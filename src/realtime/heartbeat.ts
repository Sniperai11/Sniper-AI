import { Logger } from '../api/utils/logger';

export class HeartbeatManager {
  private pingInterval: NodeJS.Timeout | null = null;
  private pongTimeout: NodeJS.Timeout | null = null;
  
  private readonly PING_INTERVAL_MS = 30000;
  private readonly PONG_TIMEOUT_MS = 10000;
  
  private sendPing: () => void;
  private onTimeout: () => void;

  constructor(sendPing: () => void, onTimeout: () => void) {
    this.sendPing = sendPing;
    this.onTimeout = onTimeout;
  }

  start() {
    this.stop();
    this.pingInterval = setInterval(() => {
      Logger.debug('[Heartbeat] Sending ping');
      this.sendPing();
      
      // If we don't receive a pong in time, consider connection dead
      this.pongTimeout = setTimeout(() => {
        Logger.warn('[Heartbeat] Pong timeout - connection likely dead');
        this.onTimeout();
      }, this.PONG_TIMEOUT_MS);
    }, this.PING_INTERVAL_MS);
  }

  registerPong() {
    Logger.debug('[Heartbeat] Received pong');
    if (this.pongTimeout) {
      clearTimeout(this.pongTimeout);
      this.pongTimeout = null;
    }
  }

  stop() {
    if (this.pingInterval) clearInterval(this.pingInterval);
    if (this.pongTimeout) clearTimeout(this.pongTimeout);
    this.pingInterval = null;
    this.pongTimeout = null;
  }
}
