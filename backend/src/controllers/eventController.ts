import { Request, Response, NextFunction } from "express";
import { EventService } from "../services/eventService";
import { AppError } from "../middlewares/errorMiddleware";

const eventService = new EventService();

export class EventController {
  // Create a new event
  async createEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const eventData = req.body;
      const newEvent = await eventService.createEvent(req.user.id, eventData);

      res.status(201).json({
        status: "success",
        data: newEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all events with pagination and filters
  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const page = req.query.page ? parseInt(req.query.page as string) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      const filters: any = {};

      if (req.query.status) filters.status = req.query.status;
      if (req.query.category) filters.category = req.query.category;
      if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
      if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
      if (req.query.search) filters.search = req.query.search;
      if (req.query.tags) {
        const tags = (req.query.tags as string).split(",").map((tag) => tag.trim());
        filters.tags = tags;
      }

      const result = await eventService.getEvents(page, limit, filters);

      res.status(200).json({
        status: "success",
        data: {
          events: result.events,
          total: result.total,
          pages: result.pages,
          currentPage: page,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // Get event by ID
  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const event = await eventService.getEventById(id);

      res.status(200).json({
        status: "success",
        data: event,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update event
  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const { id } = req.params;
      const updateData = req.body;

      const updatedEvent = await eventService.updateEvent(id, req.user.id, updateData);

      res.status(200).json({
        status: "success",
        data: updatedEvent,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete event
  async deleteEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const { id } = req.params;

      await eventService.deleteEvent(id, req.user.id);

      res.status(204).json({
        status: "success",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get user's events
  async getUserEvents(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(new AppError("Not authenticated", 401));
      }

      const events = await eventService.getUserEvents(req.user.id);

      res.status(200).json({
        status: "success",
        data: events,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get event categories
  async getEventCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await eventService.getEventCategories();

      res.status(200).json({
        status: "success",
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  }
}
