const User = require('../models/user.model');
const Profile = require('../models/user-profile.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('../middlewares/asyncHandler');
const { conflict, unauthorized, badRequest } = require('../utils/AppError');

// Refresh tokens are signed with their own secret so that a refresh token can never be
// presented as an access token. The `type` claim makes the same intent explicit in the
// payload and is checked again on verification.
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

// Cost 12 rather than the library default of 10. Each step doubles the work an offline
// cracker must do per guess, and the added latency at sign-in is a few tens of milliseconds.
const BCRYPT_ROUNDS = 12;

// Compared against when no account matches, so that a sign-in attempt costs the same whether
// or not the address exists. It must be a real hash at the same cost: bcrypt rejects a
// malformed one immediately, which would leave exactly the timing difference this removes.
const ABSENT_ACCOUNT_HASH = '$2a$12$R9HjcdJlvWBYQpNzNm.VtuJGPSPpJEDbFEQH8fvPU2J2Grl3tlpt6';

/**
 * Mints a token pair for an account.
 *
 * Both tokens carry `tokenVersion`. Authentication compares it against the stored value, so
 * bumping that field invalidates everything already issued — which is what makes sign-out and
 * administrative revocation possible at all.
 */
const issueTokens = (user) => {
  const claims = { user: user.id, tokenVersion: user.tokenVersion ?? 0 };

  return {
    accessToken: jwt.sign({ ...claims, type: 'access' }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    }),
    refreshToken: jwt.sign({ ...claims, type: 'refresh' }, refreshSecret(), {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    }),
  };
};

exports.signUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const normalizedUsername = username.trim();

  // The unique indexes are the real guard — two concurrent signups can both pass this check
  // before either writes — but answering 409 here gives the common case a clear message.
  const existing = await User.findOne({
    $or: [{ email: normalizedEmail }, { username: normalizedUsername }],
  })
    .select('email')
    .lean();

  if (existing) {
    throw conflict(
      `${existing.email === normalizedEmail ? 'Email' : 'Username'} already exists`,
      'UserExists',
    );
  }

  const user = new User({
    username: normalizedUsername,
    email: normalizedEmail,
    password: await bcrypt.hash(password, await bcrypt.genSalt(BCRYPT_ROUNDS)),
  });
  await user.save();

  // Schema defaults cover the rest of the profile; restating them here only risked drift.
  await Profile.create({ user: user._id, bio: '' });

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
  });
});

// Login API
exports.signIn = asyncHandler(async (req, res) => {
  const { credential, password } = req.body;

  // Search by email or username (case-insensitive for email)
  const user = await User.findOne({
    $or: [{ email: credential.toLowerCase() }, { username: credential }],
  });

  // One message for both failure modes, so the response never reveals which accounts exist.
  const invalid = unauthorized('Invalid email/username or password', 'AuthenticationError');

  if (!user) {
    // Spend comparable time on an unknown account as on a known one, so response timing does
    // not answer "is this address registered?" for an attacker enumerating addresses.
    await bcrypt.compare(password, ABSENT_ACCOUNT_HASH);
    throw invalid;
  }

  if (!(await bcrypt.compare(password, user.password))) {
    throw invalid;
  }

  const { accessToken, refreshToken } = issueTokens(user);

  res.status(200).json({
    success: true,
    message: 'User login successfully',
    data: {
      accessToken,
      refreshToken,
      userdata: {
        user_id: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
      },
    },
  });
});

exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken || typeof refreshToken !== 'string') {
    throw badRequest('Refresh token required', 'TokenMissing');
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, refreshSecret());
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      throw unauthorized('Invalid or expired refresh token', 'InvalidToken');
    }
    throw error;
  }

  // Reject an access token presented here, mirroring the check in authenticateUser.
  if (decoded.type && decoded.type !== 'refresh') {
    throw unauthorized('Invalid token type', 'InvalidToken');
  }

  // Roles come from the account, never from the presented token. Copying them out of the
  // payload meant a demoted administrator kept their privileges for the refresh token's full
  // lifetime, and could keep minting fresh access tokens the whole time.
  const user = await User.findById(decoded.user).select('roles tokenVersion').lean();

  if (!user || (decoded.tokenVersion ?? 0) !== (user.tokenVersion ?? 0)) {
    throw unauthorized('Session is no longer valid, please sign in again', 'InvalidToken');
  }

  const accessToken = jwt.sign(
    { user: decoded.user, tokenVersion: user.tokenVersion ?? 0, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
  );

  res.status(200).json({
    success: true,
    message: 'Access token generated successfully',
    data: { accessToken },
  });
});

/**
 * Ends every session for the calling account.
 *
 * Tokens are stateless, so "logging out" client-side only forgets them — anyone who captured
 * one could still use it. Bumping tokenVersion is what actually invalidates them server-side.
 */
exports.signOut = asyncHandler(async (req, res) => {
  await User.updateOne({ _id: req.user.id }, { $inc: { tokenVersion: 1 } });

  res.status(200).json({
    success: true,
    message: 'Signed out on all devices',
  });
});

/**
 * Changes the caller's password.
 *
 * The current password is required even though the caller is already authenticated: it is
 * what stops a borrowed or stolen session from locking the real owner out of their account.
 *
 * Succeeding invalidates every existing token, including the one that made this request. That
 * is the point — if the change is being made because the old password leaked, sessions opened
 * with it must not survive.
 */
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('password tokenVersion');
  if (!user) throw unauthorized('Session is no longer valid, please sign in again');

  if (!(await bcrypt.compare(currentPassword, user.password))) {
    throw unauthorized('Current password is incorrect', 'InvalidPassword');
  }

  if (await bcrypt.compare(newPassword, user.password)) {
    throw badRequest('New password must be different from the current one', 'PasswordUnchanged');
  }

  user.password = await bcrypt.hash(newPassword, await bcrypt.genSalt(BCRYPT_ROUNDS));
  user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed. Please sign in again.',
  });
});
