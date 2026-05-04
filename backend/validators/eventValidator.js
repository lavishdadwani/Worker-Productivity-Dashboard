import Joi from "joi";

export const eventSchema = Joi.object({
  event_id: Joi.string().optional(),

  timestamp: Joi.date().required(),

  worker_id: Joi.string()
    .pattern(/^W[1-6]$/)
    .required(),

  workstation_id: Joi.string()
    .pattern(/^S[1-6]$/)
    .required(),

  event_type: Joi.string()
    .valid("working", "idle", "absent", "product_count")
    .required(),

  confidence: Joi.number().min(0).max(1).optional().allow(null),

  count: Joi.when("event_type", {
    is: "product_count",
    then: Joi.number().integer().min(1).required(),
    otherwise: Joi.optional(),
  }),
});