import { eventBus } from './eventBus';
import { connectionMonitor } from './connectionMonitor';
import { wsClient } from './websocketClient';
import { SecurityEvent } from './types';
import { Logger } from '../api/utils/logger';

export const RealtimeSimulator = {
  simulateConnectionLoss: () => {
    Logger.info('[Simulator] Simulating connection loss...');
    // Force disconnect without intention
    (wsClient as any).intentionallyClosed = false;
    if ((wsClient as any).ws) {
      (wsClient as any).ws.close(1006, 'Abnormal Closure Simulation');
    }
  },

  simulateReconnect: () => {
    Logger.info('[Simulator] Simulating manual reconnect...');
    wsClient.connect();
  },

  simulateDuplicateEvents: () => {
    Logger.info('[Simulator] Simulating duplicate events...');
    const eventId = `evt-${Date.now()}`;
    const evt: SecurityEvent = {
      id: eventId,
      timestamp: Date.now(),
      type: 'SECURITY_EVENT',
      severity: 'High',
      description: 'Simulated brute force attack',
      source: '192.168.1.100'
    };

    // Publish twice
    eventBus.publish('SECURITY_EVENT', evt);
    Logger.info('[Simulator] Published event 1');
    setTimeout(() => {
      eventBus.publish('SECURITY_EVENT', evt);
      Logger.info('[Simulator] Published event 2 (duplicate)');
    }, 100);
  },

  simulateOutOfOrderEvents: () => {
    Logger.info('[Simulator] Simulating out of order events...');
    const now = Date.now();
    const evt2: SecurityEvent = {
      id: `evt-2`,
      timestamp: now,
      sequence: 2,
      type: 'SECURITY_EVENT',
      severity: 'Medium',
      description: 'Sequence 2 event',
      source: 'AppServer'
    };
    
    const evt1: SecurityEvent = {
      id: `evt-1`,
      timestamp: now - 1000,
      sequence: 1,
      type: 'SECURITY_EVENT',
      severity: 'Low',
      description: 'Sequence 1 event',
      source: 'AppServer'
    };

    // In a real scenario, the consumer hook would use `sequence` to sort or reorder
    eventBus.publish('SECURITY_EVENT', evt2);
    setTimeout(() => {
      eventBus.publish('SECURITY_EVENT', evt1);
    }, 500);
  },

  simulateHeartbeatTimeout: () => {
    Logger.info('[Simulator] Simulating heartbeat timeout...');
    // Overriding the pong timeout to trigger immediately
    if ((wsClient as any).heartbeat) {
      ((wsClient as any).heartbeat as any).handleTimeout = () => {
        Logger.warn('[Heartbeat] Simulated Pong timeout - connection likely dead');
        if ((wsClient as any).ws) {
          (wsClient as any).ws.close(4000, 'Heartbeat Timeout Simulation');
        }
      };
      // Manually call it
      ((wsClient as any).heartbeat as any).handleTimeout();
    }
  }
};
