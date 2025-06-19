import express from "express";
import { EventRegistrationController } from "../controllers/eventRegistrationController";
import { authenticate, requireEmailVerification } from "../middlewares/authMiddleware";

const router = express.Router();
const eventRegistrationController = new EventRegistrationController();

// All routes require authentication
router.use(authenticate);

// Routes that require email verification
// POST /registrations/:eventId - Register for an event
router.post("/:eventId", requireEmailVerification, eventRegistrationController.registerForEvent);

// DELETE /registrations/:eventId - Cancel registration
router.delete("/:eventId", requireEmailVerification, eventRegistrationController.cancelRegistration);

// GET /registrations/user/my-events - Get user's registrations
router.get("/user/my-events", requireEmailVerification, eventRegistrationController.getUserRegistrations);

// GET /registrations/:eventId/attendees - Get event registrations (for organizers)
router.get("/:eventId/attendees", eventRegistrationController.getEventRegistrations);

// GET /registrations/:eventId/status - Check if user is registered
router.get("/:eventId/status", eventRegistrationController.checkRegistrationStatus);

// GET /registrations/:eventId/stats - Get event statistics
router.get("/:eventId/stats", eventRegistrationController.getEventStats);

// POST /registrations/verify-ticket - Verify ticket by QR code
router.post("/verify-ticket", eventRegistrationController.verifyTicket);

export default router;
