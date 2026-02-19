import attemptRepository from '../repositories/attempt-repository.js';

/**
 * Middleware to check if an attempt is already submitted.
 * Use on routes that modify logs (POST /logs, etc.)
 * Expects attemptId in req.body or req.params.
 */
export const ensureAttemptActive = async (req, res, next) => {
  try {
    const attemptId =
      req.body.attemptId || req.params.attemptId || req.query.attemptId;

    if (!attemptId) {
      return res.status(400).json({
        success: false,
        message: 'attemptId is required',
      });
    }

    const attempt = await attemptRepository.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found',
      });
    }

    if (attempt.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Attempt is already submitted. No further modifications allowed.',
      });
    }

    next();
  } catch (error) {
    next(error);
  }
};