import { env } from '../api/config/env';
import { Logger } from '../api/utils/logger';
import { getToken } from '../api/auth/tokenManager';
import { eventPipeline } from './pipeline';
import { connectionMonitor } from './connectionMonitor';
import { HeartbeatManager } from './heartbeat';
import { ReconnectManager } from './reconnectManager';
import { WsMessage } from './types';

class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private heartbeat: HeartbeatManager;
  private reconnectManager: ReconnectManager;
  private intentionallyClosed = false;

  constructor(url: string) {
    this.url = url;
    
    this.heartbeat = new HeartbeatManager(
      () => this.send({ event: 'ping', payload: {} }),
      () => this.handleTimeout()
    );
    
    this.reconnectManager = new ReconnectManager(() => this.connect());
  }

  connect() {
    if (this.ws?.readyState === WebSocket.CONNECTING || this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const token = getToken();
    if (!token) {
      Logger.warn('[WebSocketClient] No auth token available, unable to connect');
      connectionMonitor.setState('Authentication Failed');
      return;
    }

    // Checking if we are retrying vs initial connection
    const isReconnecting = connectionMonitor.state === 'Disconnected' || connectionMonitor.state === 'Reconnecting';
    connectionMonitor.setState(isReconnecting ? 'Reconnecting' : 'Connecting');
    this.intentionallyClosed = false;

    // Connect with token in query params
    const wsUrl = `${this.url}?token=${token}`;
    
    try {
      this.ws = new WebSocket(wsUrl);
      
      this.ws.onopen = this.onOpen.bind(this);
      this.ws.onmessage = this.onMessage.bind(this);
      this.ws.onclose = this.onClose.bind(this);
      this.ws.onerror = this.onError.bind(this);
    } catch (err) {
      Logger.error('[WebSocketClient] Failed to create WebSocket instance', err);
      this.reconnectManager.scheduleReconnect();
    }
  }

  private onOpen() {
    Logger.info('[WebSocketClient] Connected successfully');
    connectionMonitor.setState('Connected');
    this.reconnectManager.reset();
    this.heartbeat.start();
  }

  private onMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data);
      
      // Handle protocol-level messages
      if (data.event === 'pong') {
        this.heartbeat.registerPong();
        return;
      }

      if (data.event === 'auth_error') {
        Logger.error('[WebSocketClient] Server rejected authentication');
        connectionMonitor.setState('Authentication Failed');
        this.disconnect();
        return;
      }

      // Publish application messages through the Event Pipeline
      if (data.payload) {
        eventPipeline.processRawEvent(data.payload);
      } else {
        eventPipeline.processRawEvent(data);
      }
      
    } catch (err) {
      Logger.error('[WebSocketClient] Failed to parse incoming message', err);
    }
  }

  private onClose(event: CloseEvent) {
    Logger.info(`[WebSocketClient] Connection closed: Code ${event.code} - ${event.reason}`);
    this.heartbeat.stop();
    
    // Auth failures typically use 4001 or 4003 custom codes
    if (event.code === 4001 || event.code === 4003) {
      connectionMonitor.setState('Authentication Failed');
      return; 
    }

    if (!this.intentionallyClosed) {
      connectionMonitor.setState('Disconnected');
      this.reconnectManager.scheduleReconnect();
    } else {
      connectionMonitor.setState('Disconnected');
    }
  }

  private onError(error: Event) {
    Logger.error('[WebSocketClient] WebSocket error observed');
    // We let onClose handle the reconnect logic, as a close event always follows an error event.
  }

  private handleTimeout() {
    Logger.warn('[WebSocketClient] Heartbeat timeout, dropping connection to trigger reconnect');
    if (this.ws) {
      // Force close
      this.ws.close(4000, 'Heartbeat Timeout');
    }
  }

  send(message: WsMessage) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      Logger.warn('[WebSocketClient] Cannot send message, WebSocket not open');
    }
  }

  disconnect() {
    this.intentionallyClosed = true;
    this.reconnectManager.stop();
    this.heartbeat.stop();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnected intentionally');
      this.ws = null;
    }
  }

  subscribeToChannel(channel: string) {
    this.send({ event: 'subscribe', channel, payload: {} });
  }

  unsubscribeFromChannel(channel: string) {
    this.send({ event: 'unsubscribe', channel, payload: {} });
  }
}

// Global Singleton Instance
export const wsClient = new WebSocketClient(env.WS_URL);
