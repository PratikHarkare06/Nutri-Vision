const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const { createAppError } = require("../utils/createAppError");

const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(createAppError(401, "UNAUTHORIZED", "Please log in to access this feature."));
    }

    // Verify token
    const JWT_SECRET = process.env.JWT_SECRET || "nutrixa-jwt-super-secret-key-12345";
    const decoded = jwt.verify(token, JWT_SECRET);

    // Fetch user
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return next(createAppError(401, "UNAUTHORIZED", "The user belonging to this token no longer exists."));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return next(createAppError(401, "UNAUTHORIZED", "Session expired. Please log in again."));
  }
};

const optionalProtect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(); // Guest user, proceed without setting req.user
    }

    const JWT_SECRET = process.env.JWT_SECRET || "nutrixa-jwt-super-secret-key-12345";
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (user) {
      req.user = user;
    }
    next();
  } catch (error) {
    console.log("Optional Auth failed (invalid token, running as guest):", error.message);
    next();
  }
};

module.exports = { protect, optionalProtect };
