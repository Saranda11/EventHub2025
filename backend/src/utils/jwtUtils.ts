import jwt from "jsonwebtoken";
import { IUser } from "../models/userModel";

// Generate access token
export const generateAccessToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: (user._id as any).toString(),
      role: user.role,
    },
    process.env.JWT_ACCESS_SECRET || "access_secret",
    {
      expiresIn: "15m",
    }
  );
};

// Generate refresh token
export const generateRefreshToken = (user: IUser): string => {
  return jwt.sign(
    {
      id: (user._id as any).toString(),
    },
    process.env.JWT_REFRESH_SECRET || "refresh_secret",
    {
      expiresIn: "7d",
    }
  );
};

// Verify refresh token
export const verifyRefreshToken = (refreshToken: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "refresh_secret", (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};
