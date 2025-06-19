import express from "express";
import { UserController } from "../controllers/userController";
import { authenticate } from "../middlewares/authMiddleware";
import { updateProfileValidationRules, validate } from "../middlewares/validationMiddleware";

const router = express.Router();
const userController = new UserController();

// Protected routes - require authentication
router.use(authenticate);

// GET /user/profile - Get user profile
router.get("/profile", userController.getProfile);

// PATCH /user/profile - Update user profile
router.patch("/profile", updateProfileValidationRules, validate, userController.updateProfile);

export default router;
