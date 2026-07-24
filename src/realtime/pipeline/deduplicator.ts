import { RealtimeEvent } from '../types';
import { pipelineMetrics } from './metrics';

export class Deduplicator {
  private seenIds: Set<string> = new Set();
  private maxCacheSize: number;

  constructor(maxCacheSize: number = 1000) {
    this.maxCacheSize = maxCacheSize;
  }

  isDuplicate(event: RealtimeEvent): boolean {
    if (this.seenIds.has(event.id)) {
      pipelineMetrics.recordDuplicate();
      return true;
    }

    this.seenIds.add(event.id);
    if (this.seenIds.size > this.maxCacheSize) {
      // Very simple LRU approach for a Set
      const firstId = this.seenIds.values().next().value;
      if (firstId) {
        this.seenIds.delete(firstId);
      }
    }
    return false;
  }
}
