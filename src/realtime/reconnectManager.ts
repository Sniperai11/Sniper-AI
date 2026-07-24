import { Logger } from '../api/utils/logger';

export class ReconnectManager {
  private attempts = 0;
  private readonly maxAttempts = 10;
  private readonly baseDelay = 1000; // 1 second
  private readonly maxDelay = 30000; // 30 seconds
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectFn: () => void;

  constructor(connectFn: () => void) {
    this.connectFn = connectFn;
  }

  scheduleReconnect() {
    if (this.attempts >= this.maxAttempts) {
      Logger.error('[ReconnectManager] Max reconnect attempts reached. Giving up.');
      return;
    }

    // Exponential backoff
    let delay = this.baseDelay * Math.pow(1.5, this.attempts);
    if (delay > this.maxDelay) {
      delay = this.maxDelay;
    }
    
    // Add jitter (0-1000ms) to prevent thundering herd
    const jitter = Math.random() * 1000;
    const nextAttemptIn = delay + jitter;

    this.attempts++;
    Logger.info(`[ReconnectManager] Scheduling reconnect attempt ${this.attempts} in ${Math.round(nextAttemptIn)}ms`);

    this.reconnectTimer = setTimeout(() => {
      this.connectFn();
    }, nextAttemptIn);
  }

  reset() {
    this.attempts = 0;
    this.stop();
  }

  stop() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}
