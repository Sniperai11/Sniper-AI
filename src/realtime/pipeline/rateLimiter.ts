import { RealtimeEvent } from '../types';

export class RateLimiter {
  private queue: RealtimeEvent[] = [];
  private isProcessing = false;
  private readonly rateLimitMs: number;
  private readonly batchMode: boolean;

  constructor(rateLimitMs: number = 100, batchMode: boolean = false) {
    this.rateLimitMs = rateLimitMs;
    this.batchMode = batchMode;
  }

  enqueue(event: RealtimeEvent, onRelease: (evt: RealtimeEvent | RealtimeEvent[]) => void) {
    this.queue.push(event);
    if (!this.isProcessing) {
      this.processQueue(onRelease);
    }
  }

  private processQueue(onRelease: (evt: RealtimeEvent | RealtimeEvent[]) => void) {
    if (this.queue.length === 0) {
      this.isProcessing = false;
      return;
    }

    this.isProcessing = true;

    if (this.batchMode) {
      const batch = [...this.queue];
      this.queue = [];
      onRelease(batch);
    } else {
      const event = this.queue.shift()!;
      onRelease(event);
    }

    setTimeout(() => {
      this.processQueue(onRelease);
    }, this.rateLimitMs);
  }
}
