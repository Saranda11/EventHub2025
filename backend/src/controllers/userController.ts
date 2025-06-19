import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/userService";
import { AppError } from "../middlewares/errorMiddleware";

const userService = new UserService();

export class UserController {
  // Get user profile
  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const userProfile = await userService.getUserProfile(req.user.id);

      res.status(200).json({
        status: "success",
        data: userProfile,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user profile
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const { name, email, location, phone, bio, interests, preferredLanguage } = req.body;
      const updatedProfile = await userService.updateUserProfile(req.user.id, {
        name,
        email,
        location,
        phone,
        bio,
        interests,
        preferredLanguage,
      });

      res.status(200).json({
        status: "success",
        data: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}
