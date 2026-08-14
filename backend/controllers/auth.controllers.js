const User = require('../models/user.model');
const Profile = require('../models/user-profile.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Refresh tokens are signed with their own secret so that a refresh token can never be
// presented as an access token. The `type` claim makes the same intent explicit in the
// payload and is checked again on verification.
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const issueTokens = (user) => ({
  accessToken: jwt.sign(
    { user: user.id, roles: user.roles, type: 'access' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
  ),
  refreshToken: jwt.sign({ user: user.id, roles: user.roles, type: 'refresh' }, refreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  }),
});

exports.signUp = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Empty field',
      errors: errors.array(),
    });
  }

  const { username, email, password } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    // Check if user already exists
    let user = await User.findOne({
      $or: [{ email: normalizedEmail }, { username: username }],
    });

    if (user) {
      const field = user.email === normalizedEmail ? 'Email' : 'Username';
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        error: 'UserExists',
      });
    }

    // Create new user
    user = new User({
      username: username.trim(),
      email: normalizedEmail,
      password,
    });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Creating new user profile
    await Profile.create({
      user: user._id,
      image: { data: null, contentType: '' },
      bio: '',
      followings: [],
      followers: [],
      postCount: 0,
      followingsCount: 0,
      followersCount: 0,
    });

    res.status(201).json({
      success: true,
      message: 'User Registered Succesfully',
    });
  } catch (error) {
    // A duplicate key here means two concurrent signups raced past the findOne check;
    // the unique indexes on email and username are the real guard.
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern ?? {})[0] === 'username' ? 'Username' : 'Email';
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
        error: 'UserExists',
      });
    }

    console.error('[signUp]', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred',
      error: 'ServerError',
    });
  }
};

// Login API
exports.signIn = async (req, res) => {
  // console.log(req);

  // Check if a user is already authenticated with a valid token
  if (req.user) {
    return res.status(200).json({
      success: true,
      message: 'User is already authenticated',
    });
  }

  const { credential, password } = req.body;

  try {
    // Search by email or username (case-insensitive for email)
    const user = await User.findOne({
      $or: [{ email: credential.toLowerCase() }, { username: credential }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password',
        error: 'AuthenticationError',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email/username or password',
        error: 'AuthenticationError',
      });
    }

    const userdata = {
      user_id: user.id,
      username: user.username,
      email: user.email,
      roles: user.roles,
    };

    const { accessToken, refreshToken } = issueTokens(user);

    // Sending payload to frontend
    res.status(200).json({
      success: true,
      message: 'User login succesfully',
      data: {
        accessToken,
        refreshToken,
        userdata,
      },
    });
  } catch (error) {
    console.error('[signIn]', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'ServerError',
    });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      message: 'Refresh token required',
      error: 'TokenMissing',
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, refreshSecret());

    // Reject an access token presented here, mirroring the check in authenticateUser.
    if (decoded.type && decoded.type !== 'refresh') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token type',
      });
    }

    const accessToken = jwt.sign(
      { user: decoded.user, roles: decoded.roles, type: 'access' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' },
    );

    return res.status(200).json({
      success: true,
      message: 'Access token generated succesfully',
      data: { accessToken },
    });
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'ServerError',
    });
  }
};
