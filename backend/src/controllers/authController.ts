import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";
import { AppError } from "../middlewares/errorMiddleware";

const authService = new AuthService();

export class AuthController {
  // Register a new user
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.signup({ name, email, password });

      res.status(201).json({
        status: "success",
        data: result,
        message: "Registration successful. Please check your email to verify your account.",
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify email by token
  async verifyEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;

      if (!token) {
        return next(new AppError("Verification token is required", 400));
      }

      const result = await authService.verifyEmail(token);

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify email by code
  async verifyEmailByCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, code } = req.body;

      if (!email || !code) {
        return next(new AppError("Email and verification code are required", 400));
      }

      const result = await authService.verifyEmailByCode(email, code);

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Resend verification email
  async resendVerificationEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      if (!email) {
        return next(new AppError("Email is required", 400));
      }

      const result = await authService.resendVerificationEmail(email);

      res.status(200).json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Login user
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Refresh access token
  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return next(new AppError("Refresh token is required", 400));
      }

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Logout user
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      await authService.logout(req.user.id);

      res.status(200).json({
        status: "success",
        message: "Logged out successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}
