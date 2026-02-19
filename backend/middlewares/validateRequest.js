/**
 * Validates request body against a Joi schema.
 * @param {Object} schema - Joi schema
 * @returns {Function} Express middleware
 */
export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.details.map((detail) => ({
          message: detail.message,
          path: detail.path,
        })),
      });
    }
    // Replace req.body with sanitized value
    req.body = value;
    next();
  };
};