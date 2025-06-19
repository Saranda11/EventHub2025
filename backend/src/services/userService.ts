import User, { IUser } from "../models/userModel";
import { AppError } from "../middlewares/errorMiddleware";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  location?: string;
  phone?: string;
  bio?: string;
  interests?: string;
  preferredLanguage?: string;
}

export class UserService {
  // Get user profile
  async getUserProfile(userId: string): Promise<UserProfile> {
    const user = await User.findById(userId).select("-password -refreshToken");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      location: user.location,
      phone: user.phone,
      bio: user.bio,
      interests: user.interests,
      preferredLanguage: user.preferredLanguage,
    };
  }

  // Update user profile
  async updateUserProfile(
    userId: string,
    updateData: {
      name?: string;
      email?: string;
      location?: string;
      phone?: string;
      bio?: string;
      interests?: string;
      preferredLanguage?: string;
    }
  ): Promise<UserProfile> {
    // Check if email is already in use (if updating email)
    if (updateData.email) {
      const existingUser = await User.findOne({ email: updateData.email });
      if (existingUser && (existingUser._id as any).toString() !== userId) {
        throw new AppError("Email already in use", 400);
      }
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password -refreshToken");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return {
      id: (user._id as any).toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      location: user.location,
      phone: user.phone,
      bio: user.bio,
      interests: user.interests,
      preferredLanguage: user.preferredLanguage,
    };
  }
}
