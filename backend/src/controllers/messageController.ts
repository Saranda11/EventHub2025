import { Request, Response, NextFunction } from "express";
import { MessageService } from "../services/messageService";
import { AppError } from "../middlewares/errorMiddleware";

const messageService = new MessageService();

export class MessageController {
  // Create a new contact message
  async createMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, subject, message, department } = req.body;

      const newMessage = await messageService.createMessage({
        name,
        email,
        subject,
        message,
        department,
      });

      res.status(201).json({
        status: "success",
        message: "Message sent successfully",
        data: newMessage,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all messages (admin only)
  async getAllMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const messages = await messageService.getAllMessages();

      res.status(200).json({
        status: "success",
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get message by ID (admin only)
  async getMessageById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const message = await messageService.getMessageById(id);

      res.status(200).json({
        status: "success",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update message status (admin only)
  async updateMessageStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["unread", "read", "responded"].includes(status)) {
        return next(new AppError("Invalid status value", 400));
      }

      const updatedMessage = await messageService.updateMessageStatus(id, status);

      res.status(200).json({
        status: "success",
        data: updatedMessage,
      });
    } catch (error) {
      next(error);
    }
  }
} 