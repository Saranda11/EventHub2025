import Event, { IEvent } from "../models/eventModel";
import { AppError } from "../middlewares/errorMiddleware";
import mongoose from "mongoose";

export interface EventData {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  category: string;
  maxAttendees: number;
  ticketPrice: number;
  imageUrl?: string;
  tags?: string[];
}

export class EventService {
  // Create a new event
  async createEvent(userId: string, eventData: EventData): Promise<IEvent> {
    if (new Date(eventData.startDate) > new Date(eventData.endDate)) {
      throw new AppError("End date must be after start date", 400);
    }

    const newEvent = await Event.create({
      ...eventData,
      organizer: new mongoose.Types.ObjectId(userId),
    });

    // Populate organizer details and return the event
    await newEvent.populate("organizer", "name email");

    return newEvent;
  }

  // Get all events with pagination and filters
  async getEvents(
    page: number = 1,
    limit: number = 10,
    filters: {
      status?: string;
      category?: string;
      startDate?: Date;
      endDate?: Date;
      search?: string;
      tags?: string[];
    } = {}
  ): Promise<{ events: IEvent[]; total: number; pages: number }> {
    const query: any = {};

    // Apply filters
    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.startDate || filters.endDate) {
      query.startDate = {};
      if (filters.startDate) {
        query.startDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.endDate = { $lte: new Date(filters.endDate) };
      }
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { description: { $regex: filters.search, $options: "i" } },
        { location: { $regex: filters.search, $options: "i" } },
      ];
    }

    if (filters.tags && filters.tags.length > 0) {
      query.tags = { $in: filters.tags };
    }

    const skip = (page - 1) * limit;

    const [events, total] = await Promise.all([
      Event.find(query).sort({ startDate: 1 }).skip(skip).limit(limit).populate("organizer", "name email"),
      Event.countDocuments(query),
    ]);

    const pages = Math.ceil(total / limit);

    return { events, total, pages };
  }

  // Get event by ID
  async getEventById(eventId: string): Promise<IEvent> {
    const event = await Event.findById(eventId).populate("organizer", "name email");

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    return event;
  }

  // Update event
  async updateEvent(eventId: string, userId: string, updateData: Partial<EventData>): Promise<IEvent> {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== userId) {
      throw new AppError("You are not authorized to update this event", 403);
    }

    // If updating dates, validate them
    if (
      (updateData.startDate && !updateData.endDate && new Date(updateData.startDate) > new Date(event.endDate)) ||
      (updateData.endDate && !updateData.startDate && new Date(event.startDate) > new Date(updateData.endDate)) ||
      (updateData.startDate && updateData.endDate && new Date(updateData.startDate) > new Date(updateData.endDate))
    ) {
      throw new AppError("End date must be after start date", 400);
    }

    const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, {
      new: true,
      runValidators: true,
    }).populate("organizer", "name email");

    if (!updatedEvent) {
      throw new AppError("Event not found", 404);
    }

    return updatedEvent;
  }

  // Delete event
  async deleteEvent(eventId: string, userId: string): Promise<void> {
    const event = await Event.findById(eventId);

    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== userId) {
      throw new AppError("You are not authorized to delete this event", 403);
    }

    await Event.findByIdAndDelete(eventId);
  }

  // Get events created by a specific user
  async getUserEvents(userId: string): Promise<IEvent[]> {
    return Event.find({ organizer: userId }).sort({ startDate: 1 });
  }

  // Get event categories (predefined categories that match frontend)
  async getEventCategories(): Promise<string[]> {
    // Return the predefined categories that match the frontend
    return ["Akademik", "Teknologjik", "Kulturor", "Sportiv", "Social"];
  }
}
