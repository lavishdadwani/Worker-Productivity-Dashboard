import { eventSchema } from "../validators/eventValidator.js";

export const validateEvent = (req, res, next) => {
  const { error } = eventSchema.validate(req.body, {
    abortEarly: false, // show all errors
  });

  if (error) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};