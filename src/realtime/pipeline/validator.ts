import { RealtimeEvent } from '../types';
import { Logger } from '../../api/utils/logger';
import { pipelineMetrics } from './metrics';

export class EventValidator {
  static validate(rawEvent: any): RealtimeEvent | null {
    if (!rawEvent || typeof rawEvent !== 'object') {
      Logger.warn('[EventValidator] Invalid event payload: not an object');
      pipelineMetrics.recordDropped();
      return null;
    }

    if (!rawEvent.id || !rawEvent.type) {
      Logger.warn('[EventValidator] Missing required fields (id, type)', rawEvent);
      pipelineMetrics.recordDropped();
      return null;
    }

    // Add additional schema validation as needed based on event type
    return rawEvent as RealtimeEvent;
  }
}
