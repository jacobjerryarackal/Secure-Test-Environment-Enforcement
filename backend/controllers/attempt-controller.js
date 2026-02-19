import attemptRepository from '../repositories/attempt-repository.js';
import logRepository from '../repositories/log-repository.js';

export const createAttempt = async (req, res, next) => {
  try {
    const { attemptId, candidateName, candidateEmail, metadata } = req.body;
    // Check if attempt already exists
    const exists = await attemptRepository.exists(attemptId);
    if (exists) {
      return res.status(409).json({
        success: false,
        message: 'Attempt with this ID already exists',
      });
    }

    const attempt = await attemptRepository.create({
      attemptId,
      candidateName,
      candidateEmail,
      metadata,
      startTime: new Date(),
      status: 'active',
    });

    // Log the assessment_start event automatically
    await logRepository.createMany([
      {
        eventType: 'assessment_start',
        timestamp: new Date(),
        attemptId,
        metadata: { ...metadata, candidateEmail },
      },
    ]);

    res.status(201).json({
      success: true,
      data: attempt,
    });
  } catch (error) {
    next(error);
  }
};

export const submitAttempt = async (req, res, next) => {
  try {
    const { attemptId, endTime } = req.body;

    // 1. Create submission log (bypasses active check)
    await logRepository.createSubmissionLog(attemptId, {
      submittedAt: endTime || new Date().toISOString(),
    });

    // 2. Atomically update attempt status only if still active
    const attempt = await attemptRepository.updateStatusIfActive(
      attemptId,
      'submitted',
      endTime || new Date()
    );

    if (!attempt) {
      return res.status(400).json({
        success: false,
        message: 'Attempt not found or already submitted',
      });
    }

    // 3. Mark all existing logs as immutable
    await logRepository.markImmutableByAttemptId(attemptId);

    res.json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
};

export const getAttempt = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const attempt = await attemptRepository.findById(attemptId);
    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: 'Attempt not found',
      });
    }
    res.json({ success: true, data: attempt });
  } catch (error) {
    next(error);
  }
};