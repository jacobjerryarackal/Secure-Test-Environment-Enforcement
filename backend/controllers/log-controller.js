import logRepository from '../repositories/log-repository.js';

export const receiveLogs = async (req, res, next) => {
  console.log('📥 Received logs batch:', JSON.stringify(req.body, null, 2));
  try {
    const { logs } = req.body;

    const created = await logRepository.createMany(logs);

    res.status(201).json({
      success: true,
      count: created.length,
      data: created,
    });
  } catch (error) {
    // Handle business logic errors (attempt inactive, etc.)
    if (error.message.includes('already submitted')) {
      return res.status(403).json({
        success: false,
        message: error.message,
      });
    }
    next(error);
  }
};

export const getLogsByAttempt = async (req, res, next) => {
  try {
    const { attemptId } = req.params;
    const logs = await logRepository.findByAttemptId(attemptId);
    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};