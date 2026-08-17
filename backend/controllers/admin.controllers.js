const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const asyncHandler = require('../middlewares/asyncHandler');
const { purgeAccount } = require('../services/accountService');
const { notFound, badRequest, unauthorized } = require('../utils/AppError');

/*
  Administrator actions on other people's accounts.

  One rule runs through all of them: an administrator may not act on their own account here.
  Settings is where you change your own, so a mis-click cannot suspend or delete the account
  doing the clicking.
*/

/** Throws unless the target is a different account than the caller. */
const assertNotSelf = (req, targetId) => {
  if (req.user.id.toString() === targetId.toString()) {
    throw badRequest('Use your own settings to change your account', 'CannotActOnSelf');
  }
};

/*
  There is deliberately no "last administrator" check here.

  Every one of these routes is behind authorizeAdmin and refuses to act on the caller, so the
  account performing the action is always an administrator other than the target — which means
  demoting, suspending or deleting the target can never bring the count to zero. A check here
  would be unreachable, and unreachable safeguards are worse than none: they read as covered.

  The case that genuinely can strand the console is an administrator deleting *their own*
  account from settings, and that is guarded where it happens, in user.controllers.
*/

/**
 * Suspends or restores an account.
 *
 * Suspension is reversible and keeps the person's content, which is what separates it from
 * deletion. Bumping tokenVersion is what makes it take effect at once: without it a suspended
 * user keeps working until their current access token expires.
 */
exports.setUserSuspended = asyncHandler(async (req, res) => {
  const { suspended } = req.body;
  assertNotSelf(req, req.params.id);

  const target = await User.findById(req.params.id).select('roles suspended username');
  if (!target) throw notFound('User not found');

  target.suspended = Boolean(suspended);
  target.suspendedAt = suspended ? new Date() : undefined;
  // Ends every session the account currently holds.
  if (suspended) target.tokenVersion = (target.tokenVersion ?? 0) + 1;
  await target.save();

  res.status(200).json({
    success: true,
    message: suspended
      ? `${target.username} is suspended and signed out everywhere`
      : `${target.username} can sign in again`,
    data: { id: target._id, suspended: target.suspended },
  });
});

/**
 * Grants or revokes administrator rights.
 *
 * Revoking also bumps tokenVersion, so the demoted account stops being treated as an
 * administrator on its very next request rather than on its next sign-in.
 */
exports.setUserRole = asyncHandler(async (req, res) => {
  const { admin } = req.body;
  assertNotSelf(req, req.params.id);

  const target = await User.findById(req.params.id).select('roles username tokenVersion');
  if (!target) throw notFound('User not found');

  target.roles = admin ? ['user', 'admin'] : ['user'];
  if (!admin) target.tokenVersion = (target.tokenVersion ?? 0) + 1;
  await target.save();

  res.status(200).json({
    success: true,
    message: admin
      ? `${target.username} is now an administrator`
      : `${target.username} is no longer an administrator`,
    data: { id: target._id, roles: target.roles },
  });
});

/**
 * Deletes another account and everything it owns.
 *
 * Requires the administrator's own password. Holding an admin session is not by itself
 * authority to destroy somebody else's account and every word they wrote — the same reason
 * self-deletion asks for a password.
 */
exports.deleteUser = asyncHandler(async (req, res) => {
  const { password } = req.body;
  assertNotSelf(req, req.params.id);

  const actor = await User.findById(req.user.id).select('password');
  if (!actor) throw unauthorized('Session is no longer valid, please sign in again');
  if (!(await bcrypt.compare(password, actor.password))) {
    throw unauthorized('Your password is incorrect', 'InvalidPassword');
  }

  const target = await User.findById(req.params.id).select('roles username');
  if (!target) throw notFound('User not found');

  const { posts } = await purgeAccount(target._id);

  res.status(200).json({
    success: true,
    message: `${target.username} and ${posts} ${posts === 1 ? 'story' : 'stories'} were deleted`,
  });
});
