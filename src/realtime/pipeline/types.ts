import { RealtimeEvent, BaseEvent } from '../types';

export interface PipelineMetrics {
  eventsReceived: number;
  eventsProcessed: number;
  eventsDropped: number;
  eventsDuplicated: number;
  reconnectCount: number;
  averageLatencyMs: number;
  eventsPerSecond: number;
}

export interface SubscriptionFilter {
  types?: string[];
  severities?: string[];
  assets?: string[];
  organizations?: string[];
  agents?: string[];
}

export interface PipelineConfig {
  deduplicationCacheSize: number;
  orderingBufferTimeMs: number;
  rateLimitIntervalMs: number;
  replayBufferSize: number;
}

export type EventProcessor = (event: RealtimeEvent) => RealtimeEvent | null | Promise<RealtimeEvent | null>;
