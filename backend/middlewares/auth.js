import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * =========================
 * AUTHENTICATION MIDDLEWARE
 * =========================
 * Protects private routes using JWT
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Check token in header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2. No token
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing"
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach user to request
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid token"
    });
  }
};

export default protect;
