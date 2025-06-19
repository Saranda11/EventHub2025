import Message, { IMessage } from "../models/messageModel";
import { AppError } from "../middlewares/errorMiddleware";

export interface CreateMessageData {
  name: string;
  email: string;
  subject: string;
  message: string;
  department: "general" | "technical" | "partnerships" | "careers";
}

export class MessageService {
  // Create a new message
  async createMessage(messageData: CreateMessageData): Promise<IMessage> {
    try {
      const message = new Message(messageData);
      const savedMessage = await message.save();
      return savedMessage;
    } catch (error: any) {
      throw new AppError("Failed to create message", 500);
    }
  }

  // Get all messages (for admin)
  async getAllMessages(): Promise<IMessage[]> {
    try {
      const messages = await Message.find().sort({ createdAt: -1 });
      return messages;
    } catch (error: any) {
      throw new AppError("Failed to fetch messages", 500);
    }
  }

  // Get message by ID
  async getMessageById(messageId: string): Promise<IMessage> {
    try {
      const message = await Message.findById(messageId);
      if (!message) {
        throw new AppError("Message not found", 404);
      }
      return message;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to fetch message", 500);
    }
  }

  // Update message status
  async updateMessageStatus(messageId: string, status: "unread" | "read" | "responded"): Promise<IMessage> {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { status },
        { new: true }
      );
      
      if (!message) {
        throw new AppError("Message not found", 404);
      }
      
      return message;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError("Failed to update message status", 500);
    }
  }
} 