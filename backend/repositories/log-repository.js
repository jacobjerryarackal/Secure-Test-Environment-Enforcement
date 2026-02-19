import EventLog from '../models/eventLog.js';
import attemptRepository from './attempt-repository.js';

class LogRepository {
  /**
   * Insert many logs in batch, but only if the attempt is still active.
   * If any log belongs to a submitted attempt, the whole batch is rejected.
   */
  async createMany(logs) {
  if (!logs || logs.length === 0) return [];

  const attemptIds = [...new Set(logs.map((log) => log.attemptId))];
  const validLogs = [];

  for (const log of logs) {
    const attempt = await attemptRepository.findById(log.attemptId);
    
    // ✅ FIX 1: If attempt doesn't exist yet, ignore the log instead of crashing
    if (!attempt) {
      console.warn(`Attempt ${log.attemptId} not found. Skipping log.`);
      continue;
    }

    // ✅ FIX 2: If attempt is submitted, ignore the log instead of crashing
    if (attempt.status !== 'active') {
      console.warn(`Attempt ${log.attemptId} is closed. Skipping log.`);
      continue;
    }

    validLogs.push(log);
  }

  if (validLogs.length === 0) return [];

  return await EventLog.insertMany(validLogs);
}

  /**
   * Mark all logs of an attempt as immutable (after submission).
   */
  async markImmutableByAttemptId(attemptId) {
    return await EventLog.updateMany(
      { attemptId },
      { $set: { immutable: true } }
    );
  }

  async findByAttemptId(attemptId) {
    return await EventLog.find({ attemptId }).sort({ timestamp: 1 });
  }

  async createSubmissionLog(attemptId, metadata = {}) {
    const log = new EventLog({
      eventType: 'assessment_submit',
      timestamp: new Date(),
      attemptId,
      metadata,
    });
    return await log.save();
  }
  
}

export default new LogRepository();