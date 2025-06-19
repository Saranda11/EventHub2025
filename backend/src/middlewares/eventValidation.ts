import { body } from "express-validator";
import { validate } from "./validationMiddleware";

// Validation rules for creating an event
export const createEventValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Event title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .notEmpty()
    .withMessage("Event description is required")
    .isLength({ min: 20 })
    .withMessage("Description must be at least 20 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date")
    .custom((value) => {
      if (new Date(value) < new Date()) {
        throw new Error("Start date cannot be in the past");
      }
      return true;
    }),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("location").notEmpty().withMessage("Event location is required"),

  body("category").notEmpty().withMessage("Event category is required"),

  body("maxAttendees")
    .notEmpty()
    .withMessage("Maximum number of attendees is required")
    .isInt({ min: 1 })
    .withMessage("Maximum attendees must be a positive integer"),

  body("ticketPrice")
    .notEmpty()
    .withMessage("Ticket price is required")
    .isFloat({ min: 0 })
    .withMessage("Ticket price must be a non-negative number"),

  body("imageUrl").optional().isURL().withMessage("Image URL must be a valid URL"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  validate,
];

// Validation rules for updating an event
export const updateEventValidationRules = [
  body("title").optional().isLength({ min: 5, max: 100 }).withMessage("Title must be between 5 and 100 characters"),

  body("description").optional().isLength({ min: 20 }).withMessage("Description must be at least 20 characters"),

  body("startDate").optional().isISO8601().withMessage("Start date must be a valid date"),

  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date")
    .custom((value, { req }) => {
      if (req.body.startDate && new Date(value) < new Date(req.body.startDate)) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("location").optional(),

  body("category").optional(),

  body("maxAttendees").optional().isInt({ min: 1 }).withMessage("Maximum attendees must be a positive integer"),

  body("ticketPrice").optional().isFloat({ min: 0 }).withMessage("Ticket price must be a non-negative number"),

  body("imageUrl").optional().isURL().withMessage("Image URL must be a valid URL"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("status").optional().isIn(["upcoming", "ongoing", "completed", "cancelled"]).withMessage("Invalid event status"),

  validate,
];
