import express from "express";
import { EventController } from "../controllers/eventController";
import { authenticate, requireEmailVerification } from "../middlewares/authMiddleware";
import { createEventValidationRules, updateEventValidationRules } from "../middlewares/eventValidation";

const router = express.Router();
const eventController = new EventController();

// Public routes
router.get("/", eventController.getEvents);
router.get("/categories", eventController.getEventCategories);
router.get("/:id", eventController.getEvent);

// Protected routes - require authentication
router.use(authenticate);

// Routes that require email verification
router.post("/", requireEmailVerification, createEventValidationRules, eventController.createEvent);
router.patch("/:id", requireEmailVerification, updateEventValidationRules, eventController.updateEvent);
router.delete("/:id", requireEmailVerification, eventController.deleteEvent);
router.get("/user/events", requireEmailVerification, eventController.getUserEvents);

export default router;
