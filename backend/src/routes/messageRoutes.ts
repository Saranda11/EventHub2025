import express from "express";
import { MessageController } from "../controllers/messageController";
import { authenticate } from "../middlewares/authMiddleware";
import { createMessageValidationRules, updateMessageStatusValidationRules } from "../middlewares/messageValidation";
import { validate } from "../middlewares/validationMiddleware";

const router = express.Router();
const messageController = new MessageController();

// Public route - Create contact message
router.post("/", createMessageValidationRules, validate, messageController.createMessage);

// Protected routes - require authentication (admin only)
router.use(authenticate);

// GET /messages - Get all messages (admin only)
router.get("/", messageController.getAllMessages);

// GET /messages/:id - Get message by ID (admin only)
router.get("/:id", messageController.getMessageById);

// PATCH /messages/:id/status - Update message status (admin only)
router.patch("/:id/status", updateMessageStatusValidationRules, validate, messageController.updateMessageStatus);

export default router; 