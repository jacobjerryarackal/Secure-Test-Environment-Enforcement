import localForage from 'localforage';

// Configure localForage instance for logs
const logQueueStore = localForage.createInstance({
  name: 'SecureTest',
  storeName: 'logQueue',
});

export interface QueuedLog {
  id: string;
  log: any;
  timestamp: number;
}

/**
 * Save a log entry to IndexedDB.
 */
export const addToQueue = async (log: any): Promise<void> => {
  const id = `log-${Date.now()}-${Math.random()}`;
  await logQueueStore.setItem(id, {
    id,
    log,
    timestamp: Date.now(),
  });
};

/**
 * Retrieve all queued logs.
 */
export const getQueue = async (): Promise<QueuedLog[]> => {
  const keys = await logQueueStore.keys();

  const items = await Promise.all(
    keys.map(async (key) => {
      const item = await logQueueStore.getItem<QueuedLog>(key);
      return item ?? null;
    })
  );

  return items.filter((x): x is QueuedLog => x !== null);
};


/**
 * Remove logs from queue (after successful send).
 */
export const removeFromQueue = async (ids: string[]): Promise<void> => {
  await Promise.all(ids.map((id) => logQueueStore.removeItem(id)));
};

/**
 * Clear entire queue (e.g., after submit).
 */
export const clearQueue = async (): Promise<void> => {
  const keys = await logQueueStore.keys();
  await Promise.all(keys.map(key => logQueueStore.removeItem(key)));
};