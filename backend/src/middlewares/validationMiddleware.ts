import { Request, Response, NextFunction } from "express";
import { validationResult, body } from "express-validator";
import { AppError } from "./errorMiddleware";

// Check validation results
export const validate = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return next(new AppError(errorMessages.join(", "), 400));
  }
  next();
};

// Validation rules for user registration
export const signupValidationRules = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

// Validation rules for user login
export const loginValidationRules = [
  body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// Validation rules for refresh token
export const refreshTokenValidationRules = [body("refreshToken").notEmpty().withMessage("Refresh token is required")];

// Validation rules for profile update
export const updateProfileValidationRules = [
  body("name").optional().notEmpty().withMessage("Name cannot be empty"),
  body("email").optional().isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("location").optional(),
  body("phone").optional(),
  body("bio").optional(),
  body("interests").optional(),
  body("preferredLanguage").optional(),
];
