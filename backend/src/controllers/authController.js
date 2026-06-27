const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { createAppError } = require("../utils/createAppError");

const JWT_SECRET = process.env.JWT_SECRET || "nutrixa-jwt-super-secret-key-12345";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return next(createAppError(400, "INVALID_DATA", "Name, email, and password are required."));
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(createAppError(400, "USER_EXISTS", "A user with this email address already exists."));
    }

    const newUser = await User.create({
      name,
      email,
      password,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        hasCompletedProfile: newUser.has_completed_profile,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    next(createAppError(500, "REGISTER_FAILED", "Failed to register user."));
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(createAppError(400, "INVALID_DATA", "Email and password are required."));
    }

    // Fetch user with password
    const user = await User.findOne({ email });
    if (!user) {
      return next(createAppError(401, "INVALID_CREDENTIALS", "Incorrect email or password."));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(createAppError(401, "INVALID_CREDENTIALS", "Incorrect email or password."));
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        hasCompletedProfile: user.has_completed_profile,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    next(createAppError(500, "LOGIN_FAILED", "Failed to log in."));
  }
};

const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        hasCompletedProfile: req.user.has_completed_profile,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
};
