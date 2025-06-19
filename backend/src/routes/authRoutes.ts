import express from "express";
import { AuthController } from "../controllers/authController";
import {
  validate,
  signupValidationRules,
  loginValidationRules,
  refreshTokenValidationRules,
} from "../middlewares/validationMiddleware";
import { authenticate } from "../middlewares/authMiddleware";

const router = express.Router();
const authController = new AuthController();

// POST /auth/signup - Register a new user
router.post("/signup", signupValidationRules, validate, authController.signup);

// POST /auth/login - Login user
router.post("/login", loginValidationRules, validate, authController.login);

// POST /auth/verify-email - Verify email address by token
router.post("/verify-email", authController.verifyEmail);

// POST /auth/verify-code - Verify email address by code
router.post("/verify-code", authController.verifyEmailByCode);

// POST /auth/resend-verification - Resend verification email
router.post("/resend-verification", authController.resendVerificationEmail);

// POST /auth/refresh-token - Refresh access token
router.post("/refresh-token", refreshTokenValidationRules, validate, authController.refreshToken);

// POST /auth/logout - Logout user
router.post("/logout", authenticate, authController.logout);

export default router;
