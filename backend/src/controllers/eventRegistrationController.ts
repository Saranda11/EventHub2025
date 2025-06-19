import { Request, Response, NextFunction } from "express";
import { EventRegistrationService } from "../services/eventRegistrationService";
import { AppError } from "../middlewares/errorMiddleware";

const eventRegistrationService = new EventRegistrationService();

export class EventRegistrationController {
  // Register for an event
  async registerForEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const { eventId } = req.params;
      const registration = await eventRegistrationService.registerForEvent(req.user.id, eventId);

      res.status(201).json({
        status: "success",
        data: registration,
        message: "Successfully registered for event. Check your email for the digital ticket.",
      });
    } catch (error) {
      next(error);
    }
  }

  // Cancel event registration
  async cancelRegistration(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const { eventId } = req.params;
      const { reason } = req.body;

      await eventRegistrationService.cancelRegistration(req.user.id, eventId, reason);

      res.status(200).json({
        status: "success",
        message: "Registration cancelled successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's registrations
  async getUserRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const registrations = await eventRegistrationService.getUserRegistrations(req.user.id);

      res.status(200).json({
        status: "success",
        data: registrations,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get event registrations (for organizers)
  async getEventRegistrations(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const { eventId } = req.params;
      const registrations = await eventRegistrationService.getEventRegistrations(eventId, req.user.id);

      res.status(200).json({
        status: "success",
        data: registrations,
      });
    } catch (error) {
      next(error);
    }
  }

  // Verify ticket
  async verifyTicket(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticketCode } = req.body;

      if (!ticketCode) {
        return next(new AppError("Ticket code is required", 400));
      }

      const result = await eventRegistrationService.verifyTicket(ticketCode);

      res.status(200).json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get event statistics
  async getEventStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const stats = await eventRegistrationService.getEventStats(eventId);

      res.status(200).json({
        status: "success",
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  // Check if user is registered for an event
  async checkRegistrationStatus(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const { eventId } = req.params;
      const registrations = await eventRegistrationService.getUserRegistrations(req.user.id);

      const isRegistered = registrations.some(
        (reg: any) => reg.event._id.toString() === eventId && reg.status !== "cancelled"
      );

      res.status(200).json({
        status: "success",
        data: { isRegistered },
      });
    } catch (error) {
      next(error);
    }
  }
}
