import crypto from 'crypto';

/**
 * Create a SHA-256 hash of a log entry to detect tampering.
 * Not strictly required, but adds auditability.
 */
export const hashLog = (logEntry) => {
  const stringified = JSON.stringify(logEntry);
  return crypto.createHash('sha256').update(stringified).digest('hex');
};