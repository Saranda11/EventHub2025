import { body } from "express-validator";

export const createMessageValidationRules = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("subject")
    .trim()
    .notEmpty()
    .withMessage("Subject is required")
    .isLength({ min: 5 })
    .withMessage("Subject must be at least 5 characters long"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long"),

  body("department")
    .optional()
    .isIn(["general", "technical", "partnerships", "careers"])
    .withMessage("Invalid department value"),
];

export const updateMessageStatusValidationRules = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["unread", "read", "responded"])
    .withMessage("Status must be one of: unread, read, responded"),
]; 