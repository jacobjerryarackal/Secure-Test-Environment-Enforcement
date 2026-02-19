import Joi from 'joi';

export const createAttemptSchema = Joi.object({
  attemptId: Joi.string().uuid().required(),
  candidateName: Joi.string().min(2).max(100).required(),
  candidateEmail: Joi.string().email().required(),
  metadata: Joi.object({
    userAgent: Joi.string().allow(''),
    screenSize: Joi.string().allow(''),
    ip: Joi.string().ip().optional(),
  }).default({}),
});

export const submitAttemptSchema = Joi.object({
  attemptId: Joi.string().uuid().required(),
  endTime: Joi.date().iso().optional(),
});