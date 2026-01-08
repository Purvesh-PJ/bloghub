const User = require('../models/user.model');
const Profile = require('../models/user-profile.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

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

    // Access token
    const accessToken = jwt.sign({ user: user.id }, process.env.JWT_SECRET, { expiresIn: '2m' });
    // Refresh token
    const refreshToken = jwt.sign({ user: user.id }, process.env.JWT_SECRET, { expiresIn: '20m' });

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
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token',
        });
      } else {
        const accessToken = jwt.sign({ user: decode.user }, process.env.JWT_SECRET, {
          expiresIn: '2m',
        });
        res.status(200).json({
          success: true,
          message: 'Access token generated succesfully',
          data: {
            accessToken,
          },
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: 'ServerError',
    });
  }
};
