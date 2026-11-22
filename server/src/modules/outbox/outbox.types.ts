export interface Outbox<T> {
  enqueue(payload: T): Promise<void>;
}
