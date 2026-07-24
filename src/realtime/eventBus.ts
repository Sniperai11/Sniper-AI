import { Logger } from '../api/utils/logger';

type EventHandler<T = any> = (payload: T) => void;

class EventBus {
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private processedEventIds: Set<string> = new Set();
  
  // LRU cache equivalent for deduplication (max 1000 items)
  private readonly MAX_CACHE_SIZE = 1000;

  subscribe<T>(eventType: string, callback: EventHandler<T>): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);

    // Return an unsubscribe function
    return () => {
      this.listeners.get(eventType)?.delete(callback);
    };
  }

  publish(eventType: string, payload: any): void {
    // 1. Deduplication Handling
    if (payload && typeof payload === 'object' && 'id' in payload) {
      if (this.processedEventIds.has(payload.id)) {
        Logger.debug(`[EventBus] Ignored duplicate event: ${payload.id}`);
        return;
      }
      this.processedEventIds.add(payload.id);
      
      // Keep cache size bounded
      if (this.processedEventIds.size > this.MAX_CACHE_SIZE) {
        const firstElement = this.processedEventIds.values().next().value;
        if (firstElement) {
          this.processedEventIds.delete(firstElement);
        }
      }
    }

    // 2. Dispatch to specific listeners
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)!.forEach(callback => {
        try {
          callback(payload);
        } catch (err) {
          Logger.error(`[EventBus] Error in listener for event ${eventType}`, err);
        }
      });
    }
    
    // 3. Dispatch to wildcard listeners (for debugging/metrics)
    if (this.listeners.has('*')) {
      this.listeners.get('*')!.forEach(callback => {
        try {
          callback({ eventType, payload });
        } catch (err) {
          Logger.error(`[EventBus] Error in wildcard listener`, err);
        }
      });
    }
  }

  clear(): void {
    this.listeners.clear();
    this.processedEventIds.clear();
  }
}

// Global Singleton Event Bus
export const eventBus = new EventBus();
