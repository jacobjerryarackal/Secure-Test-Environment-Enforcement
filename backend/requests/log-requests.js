import Joi from 'joi';

const logEntrySchema = Joi.object({
  eventType: Joi.string()
    .valid(
      'copy',
      'paste',
      'cut',
      'rightclick',
      'fullscreen_enter',
      'fullscreen_exit',
      'focus',
      'blur',
      'visibility_change',
      'timer_start',
      'timer_pause',
      'timer_end',
      'assessment_start',
      'assessment_submit',
      'batch_send',
      'offline_log',
      'answer_change'
    )
    .required(),
  timestamp: Joi.date().iso().required(),
  attemptId: Joi.string().uuid().required(),
  questionId: Joi.string().optional().allow(null),
  metadata: Joi.object().default({}),
});

export const batchLogSchema = Joi.object({
  logs: Joi.array().items(logEntrySchema).min(1).required(),
});