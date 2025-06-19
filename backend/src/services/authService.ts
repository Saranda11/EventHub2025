import User, { IUser } from "../models/userModel";
import { AppError } from "../middlewares/errorMiddleware";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtUtils";
import { isValidUniversityDomain, getAllowedDomains } from "../utils/domainValidator";
import { emailService } from "../utils/emailService";

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isEmailVerified: boolean;
  };
  accessToken: string;
  refreshToken: string;
}

export interface UserRegistration {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export class AuthService {
  // Register a new user
  async signup(userData: UserRegistration): Promise<AuthResponse> {
    // Validate university domain
    if (!isValidUniversityDomain(userData.email)) {
      const allowedDomains = getAllowedDomains().join(", ");
      throw new AppError(`Only university email addresses are allowed. Accepted domains: ${allowedDomains}`, 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    // Generate email verification token and code
    const verificationToken = emailService.generateVerificationToken();
    const verificationCode = emailService.generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // Create new user
    const user = await User.create({
      ...userData,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: verificationExpires,
      emailVerificationCode: verificationCode,
      emailVerificationCodeExpires: verificationCodeExpires,
    });

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in user document
    user.refreshToken = refreshToken;
    await user.save();

    // Send verification email with both link and code
    try {
      const verificationUrl = `${
        process.env.FRONTEND_URL || "http://localhost:5173"
      }/verify-email?token=${verificationToken}`;
      
      // Send email with verification code (primary method)
      const codeEmailHTML = emailService.generateVerificationCodeEmailHTML(user.name, verificationCode);
      
      await emailService.sendEmail({
        to: user.email,
        subject: "Kodi i Verifikimit - EventHub",
        html: codeEmailHTML,
      });
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      // Don't throw error here, allow user to register but log the issue
    }

    return {
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  // Verify email by token
  async verifyEmail(token: string): Promise<{ message: string }> {
    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Invalid or expired verification token", 400);
    }

    const wasUnverified = !user.isEmailVerified;

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;
    await user.save();

    // Send welcome email only if this is the first time verifying
    if (wasUnverified) {
      try {
        console.log(`📧 [TOKEN] Attempting to send welcome email to ${user.email} (${user.name})`);
        await emailService.sendWelcomeEmail(user.email, user.name);
        console.log(`✅ [TOKEN] Welcome email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error("❌ [TOKEN] Failed to send welcome email:", emailError);
        console.error("❌ [TOKEN] Error details:", emailError.message);
        // Don't throw error here, verification was successful
      }
    }

    return { message: "Email verified successfully" };
  }

  // Verify email by code
  async verifyEmailByCode(email: string, code: string): Promise<{ message: string }> {
    const user = await User.findOne({
      email,
      emailVerificationCode: code,
      emailVerificationCodeExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new AppError("Invalid or expired verification code", 400);
    }

    const wasUnverified = !user.isEmailVerified;

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    user.emailVerificationCode = undefined;
    user.emailVerificationCodeExpires = undefined;
    await user.save();

    // Send welcome email only if this is the first time verifying
    if (wasUnverified) {
      try {
        console.log(`📧 [CODE] Attempting to send welcome email to ${user.email} (${user.name})`);
        await emailService.sendWelcomeEmail(user.email, user.name);
        console.log(`✅ [CODE] Welcome email sent successfully to ${user.email}`);
      } catch (emailError) {
        console.error("❌ [CODE] Failed to send welcome email:", emailError);
        console.error("❌ [CODE] Error details:", emailError.message);
        // Don't throw error here, verification was successful
      }
    }

    return { message: "Email verified successfully" };
  }

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ message: string }> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.isEmailVerified) {
      throw new AppError("Email is already verified", 400);
    }

    // Generate new verification token and code
    const verificationToken = emailService.generateVerificationToken();
    const verificationCode = emailService.generateVerificationCode();
    const verificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = verificationExpires;
    user.emailVerificationCode = verificationCode;
    user.emailVerificationCodeExpires = verificationCodeExpires;
    await user.save();

    // Send verification email with code
    const codeEmailHTML = emailService.generateVerificationCodeEmailHTML(user.name, verificationCode);

    await emailService.sendEmail({
      to: user.email,
      subject: "Kodi i Verifikimit - EventHub",
      html: codeEmailHTML,
    });

    return { message: "Verification email sent successfully" };
  }

  // Login user
  async login(loginData: UserLogin): Promise<AuthResponse> {
    // Validate university domain
    if (!isValidUniversityDomain(loginData.email)) {
      const allowedDomains = getAllowedDomains().join(", ");
      throw new AppError(`Only university email addresses are allowed. Accepted domains: ${allowedDomains}`, 400);
    }

    // Find user by email
    const user = await User.findOne({ email: loginData.email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // Check password
    const isValidPassword = await user.comparePassword(loginData.password);
    if (!isValidPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Store refresh token in user document
    user.refreshToken = refreshToken;
    await user.save();

    return {
      user: {
        id: (user._id as any).toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      accessToken,
      refreshToken,
    };
  }

  // Refresh access token
  async refreshToken(token: string): Promise<{ accessToken: string }> {
    try {
      // Verify refresh token
      const decoded = await verifyRefreshToken(token);

      // Find user with the given refresh token
      const user = await User.findOne({
        _id: decoded.id,
        refreshToken: token,
      });

      if (!user) {
        throw new AppError("Invalid refresh token", 401);
      }

      // Generate new access token
      const accessToken = generateAccessToken(user);

      return { accessToken };
    } catch (error) {
      throw new AppError("Invalid refresh token", 401);
    }
  }

  // Logout user
  async logout(userId: string): Promise<void> {
    // Clear refresh token in user document
    await User.findByIdAndUpdate(userId, { refreshToken: null });
  }
}
