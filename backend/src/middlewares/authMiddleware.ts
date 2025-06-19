import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorMiddleware";
import User from "../models/userModel";

interface JwtPayload {
  id: string;
  role: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("No token provided", 401);
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new AppError("No token provided", 401);
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || "access_secret") as JwtPayload;

    // Find user by id
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new AppError("User not found", 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new AppError("Invalid token", 401));
    }
    next(error);
  }
};

// Middleware to check user role
// Middleware to check if user's email is verified
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new AppError("Not authenticated", 401));
  }

  // TEMPORARY: Skip email verification for development
  if (process.env.NODE_ENV === "development") {
    console.log("⚠️ [DEV] Skipping email verification check for development");
    return next();
  }

  if (!req.user.isEmailVerified) {
    return next(new AppError("Please verify your email address to access this feature", 403));
  }

  next();
};

// Middleware to check user role
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError("Not authenticated", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(new AppError("You do not have permission to perform this action", 403));
    }

    next();
  };
};
