import { addToQueue, getQueue, removeFromQueue, QueuedLog } from './localQueue';
import { sendLogsBatch } from './api';

export interface LogEntry {
  eventType: string;
  timestamp: string;
  attemptId: string;
  questionId?: string | null;
  metadata?: Record<string, any>;
}

class Logger {
  private queue: LogEntry[] = [];
  private attemptId: string | null = null;
  private flushInterval: ReturnType<typeof setInterval> | null = null;
  private isSubmitting = false;

  constructor() {
    this.restoreOfflineQueue();
  }

  setAttemptId(id: string) {
    this.attemptId = id;
  }

  getAttemptId(): string | null {
  return this.attemptId;
}

  async add(log: Omit<LogEntry, 'timestamp' | 'attemptId'> & { attemptId?: string }) {
    const attemptId = log.attemptId || this.attemptId;
    if (!attemptId) {
      console.warn('⚠️ No attemptId set – log skipped:', log.eventType);
      return;
    }
    const entry: LogEntry = {
      ...log,
      timestamp: new Date().toISOString(),
      attemptId,
    };
    this.queue.push(entry);
    await addToQueue(entry);
  }

  startFlushing(intervalMs = 5000) {
  if (this.flushInterval) clearInterval(this.flushInterval);
  
  // Explicitly use window.setInterval to ensure it returns a number/handle
  this.flushInterval = setInterval(() => this.flush(), intervalMs);
}

  stopFlushing() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }

  async flush(): Promise<boolean> {
  if (this.queue.length === 0) return true;
  if (this.isSubmitting) return false;

  this.isSubmitting = true;
  const logsToSend = [...this.queue];
  const offlineQueue = await getQueue();
  const allLogs = [...logsToSend, ...offlineQueue.map((q) => q.log)];

  if (allLogs.length === 0) {
    this.isSubmitting = false;
    return true;
  }

  try {
    await sendLogsBatch(allLogs);
    // ✅ SUCCESS: Clear everything
    this.queue = [];
    await removeFromQueue(offlineQueue.map((q) => q.id));
    return true;
  } catch (error: any) {
    const status = error.response?.status;

    // 🛑 If it's a 400 (Validation Error), the data is the problem. 
    // We should clear the queue so it doesn't block the app.
    if (status === 400) {
      console.error('❌ Poisoned Logs: Backend rejected data format. Clearing queue.');
      this.queue = []; 
      await removeFromQueue(offlineQueue.map((q) => q.id));
      return true; // Return true so the UI doesn't hang
    }

    // ⚠️ If it's a 500 or Network error, it might be a temporary server issue.
    // We keep the logs in the queue to try again later.
    console.error(`❌ Sync failed (Status: ${status || 'Network Error'}). Retrying later.`);
    return false; 
  } finally {
    this.isSubmitting = false;
  }
}

  private async restoreOfflineQueue() {
    const offlineQueue = await getQueue();
    this.queue.push(...offlineQueue.map((q) => q.log));
  }
}

export const logger = new Logger();