import { RealtimeEvent } from '../types';

export class EventEnricher {
  static enrich(event: RealtimeEvent): RealtimeEvent {
    const enriched = { ...event };
    
    // Normalize timestamps if missing or malformed
    if (!enriched.timestamp) {
      enriched.timestamp = Date.now();
    }

    // Assign internal processing metadata
    (enriched as any)._processedAt = Date.now();

    // Specific enrichments
    if (enriched.type === 'SECURITY_EVENT' && !enriched.severity) {
      enriched.severity = 'Low'; // default fallback
    }

    return enriched;
  }
}
