import EventRegistration, { IEventRegistration } from "../models/eventRegistrationModel";
import Event from "../models/eventModel";
import { AppError } from "../middlewares/errorMiddleware";
import { emailService } from "../utils/emailService";
import crypto from "crypto";
import QRCode from "qrcode";

export interface RegistrationData {
  eventId: string;
  userId: string;
}

export class EventRegistrationService {
  // Generate unique ticket code
  private generateTicketCode(): string {
    return crypto.randomBytes(16).toString("hex").toUpperCase();
  }

  // Generate QR code for ticket
  private async generateQRCode(ticketCode: string, eventId: string): Promise<string> {
    const qrData = JSON.stringify({
      ticketCode,
      eventId,
      timestamp: new Date().toISOString(),
    });

    try {
      const qrCodeDataURL = await QRCode.toDataURL(qrData);
      return qrCodeDataURL;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw new AppError("Failed to generate QR code", 500);
    }
  }

  // Register user for an event
  async registerForEvent(userId: string, eventId: string): Promise<IEventRegistration> {
    // Check if event exists
    const event = await Event.findById(eventId).populate("organizer", "name email");
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    // Check if event is still upcoming
    if (event.status !== "upcoming") {
      throw new AppError("Cannot register for this event", 400);
    }

    // Check if registration deadline has passed (24 hours before event)
    const registrationDeadline = new Date(event.startDate.getTime() - 24 * 60 * 60 * 1000);
    if (new Date() > registrationDeadline) {
      throw new AppError("Registration deadline has passed", 400);
    }

    // Check if user is already registered
    const existingRegistration = await EventRegistration.findOne({
      event: eventId,
      user: userId,
      status: { $ne: "cancelled" },
    });

    if (existingRegistration) {
      throw new AppError("You are already registered for this event", 400);
    }

    // Check if event has reached maximum capacity
    const currentRegistrations = await EventRegistration.countDocuments({
      event: eventId,
      status: "registered",
    });

    if (currentRegistrations >= event.maxAttendees) {
      throw new AppError("Event has reached maximum capacity", 400);
    }

    // Generate ticket code and QR code
    const ticketCode = this.generateTicketCode();
    const qrCode = await this.generateQRCode(ticketCode, eventId);

    // Create registration
    const registration = await EventRegistration.create({
      event: eventId,
      user: userId,
      ticketCode,
      qrCode,
      paymentAmount: event.ticketPrice,
      paymentStatus: event.ticketPrice > 0 ? "pending" : "completed",
    });

    // Populate the registration with event and user details
    const populatedRegistration = await EventRegistration.findById(registration._id)
      .populate("event", "title startDate endDate location")
      .populate("user", "name email");

    // Send ticket email
    try {
      await this.sendTicketEmail(populatedRegistration as any);
    } catch (emailError) {
      console.error("Failed to send ticket email:", emailError);
      // Don't throw error here, registration should still succeed
    }

    return populatedRegistration as IEventRegistration;
  }

  // Cancel event registration
  async cancelRegistration(userId: string, eventId: string, reason?: string): Promise<void> {
    const registration = await EventRegistration.findOne({
      event: eventId,
      user: userId,
      status: "registered",
    }).populate("event", "startDate title");

    if (!registration) {
      throw new AppError("Registration not found", 404);
    }

    // Check if cancellation is allowed (24 hours before event)
    const event = registration.event as any;
    const cancellationDeadline = new Date(event.startDate.getTime() - 24 * 60 * 60 * 1000);

    if (new Date() > cancellationDeadline) {
      throw new AppError("Cannot cancel registration less than 24 hours before the event", 400);
    }

    // Update registration status
    registration.status = "cancelled";
    registration.cancellationDate = new Date();
    registration.cancellationReason = reason || "User requested cancellation";

    await registration.save();
  }

  // Get user's registrations
  async getUserRegistrations(userId: string): Promise<IEventRegistration[]> {
    return EventRegistration.find({ user: userId })
      .populate("event", "title description startDate endDate location category imageUrl status")
      .sort({ registrationDate: -1 });
  }

  // Get event registrations (for organizers)
  async getEventRegistrations(eventId: string, organizerId: string): Promise<IEventRegistration[]> {
    // Verify that the user is the organizer of this event
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError("Event not found", 404);
    }

    if (event.organizer.toString() !== organizerId) {
      throw new AppError("You are not authorized to view registrations for this event", 403);
    }

    return EventRegistration.find({ event: eventId, status: { $ne: "cancelled" } })
      .populate("user", "name email")
      .sort({ registrationDate: -1 });
  }

  // Verify ticket by QR code
  async verifyTicket(
    ticketCode: string
  ): Promise<{ valid: boolean; registration?: IEventRegistration; message: string }> {
    const registration = await EventRegistration.findOne({ ticketCode })
      .populate("event", "title startDate endDate location")
      .populate("user", "name email");

    if (!registration) {
      return { valid: false, message: "Invalid ticket code" };
    }

    if (registration.status === "cancelled") {
      return { valid: false, message: "This ticket has been cancelled" };
    }

    if (registration.status === "attended") {
      return { valid: false, message: "This ticket has already been used" };
    }

    // Mark as attended
    registration.status = "attended";
    await registration.save();

    return {
      valid: true,
      registration,
      message: "Ticket verified successfully",
    };
  }

  // Send ticket email
  private async sendTicketEmail(registration: any): Promise<void> {
    const event = registration.event;
    const user = registration.user;

    const ticketEmailHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Bileta juaj për ${event.title} - EventHub</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #3b82f6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 30px; background: #f9f9f9; }
          .ticket { background: white; border: 2px dashed #3b82f6; padding: 20px; margin: 20px 0; border-radius: 8px; }
          .qr-code { text-align: center; margin: 20px 0; }
          .event-details { background: #e5f3ff; padding: 15px; border-radius: 8px; margin: 15px 0; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>EventHub</h1>
            <h2>Bileta juaj dixhitale</h2>
          </div>
          <div class="content">
            <h2>Përshëndetje ${user.name}!</h2>
            <p>Faleminderit që u regjistruat për eventin tonë. Më poshtë do të gjeni biletën tuaj dixhitale:</p>
            
            <div class="ticket">
              <h3 style="color: #3b82f6; margin-top: 0;">${event.title}</h3>
              
              <div class="event-details">
                <p><strong>📅 Data:</strong> ${new Date(event.startDate).toLocaleDateString("sq-AL", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
                <p><strong>🕐 Ora:</strong> ${new Date(event.startDate).toLocaleTimeString("sq-AL", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${new Date(event.endDate).toLocaleTimeString("sq-AL", {
      hour: "2-digit",
      minute: "2-digit",
    })}</p>
                <p><strong>📍 Vendndodhja:</strong> ${event.location}</p>
                <p><strong>🎫 Kodi i biletës:</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${
                  registration.ticketCode
                }</code></p>
              </div>

              <div class="qr-code">
                <p><strong>Kodi QR për verifikim:</strong></p>
                <img src="${registration.qrCode}" alt="QR Code" style="max-width: 200px; height: auto;" />
                <p style="font-size: 12px; color: #666;">Tregojeni këtë kod në hyrje të eventit</p>
              </div>
            </div>

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #856404; margin-top: 0;">📋 Informacione të rëndësishme:</h4>
              <ul style="color: #856404; margin: 0;">
                <li>Mbani biletën tuaj (të printuar ose në telefon) gjatë eventit</li>
                <li>Mbërrini 15 minuta para fillimit të eventit</li>
                <li>Mund ta anuloni pjesëmarrjen deri 24 orë para eventit</li>
                <li>Për pyetje, na kontaktoni në support@eventhub.com</li>
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/events/${event._id}" class="button">Shiko detajet e eventit</a>
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2024 EventHub. Të gjitha të drejtat e rezervuara.</p>
            <p>Ky email u dërgua sepse u regjistruat për një event në EventHub.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await emailService.sendEmail({
      to: user.email,
      subject: `Bileta juaj për ${event.title} - EventHub`,
      html: ticketEmailHTML,
    });
  }

  // Get event statistics
  async getEventStats(eventId: string): Promise<{
    totalRegistrations: number;
    attendedCount: number;
    cancelledCount: number;
    pendingPayments: number;
  }> {
    const [totalRegistrations, attendedCount, cancelledCount, pendingPayments] = await Promise.all([
      EventRegistration.countDocuments({ event: eventId, status: { $ne: "cancelled" } }),
      EventRegistration.countDocuments({ event: eventId, status: "attended" }),
      EventRegistration.countDocuments({ event: eventId, status: "cancelled" }),
      EventRegistration.countDocuments({ event: eventId, paymentStatus: "pending" }),
    ]);

    return {
      totalRegistrations,
      attendedCount,
      cancelledCount,
      pendingPayments,
    };
  }
}
