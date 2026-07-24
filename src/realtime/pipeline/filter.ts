import { RealtimeEvent } from '../types';
import { SubscriptionFilter } from './types';

export class EventFilter {
  static matches(event: RealtimeEvent, filter: SubscriptionFilter): boolean {
    if (filter.types && filter.types.length > 0 && !filter.types.includes(event.type)) {
      return false;
    }

    // Specific filtering based on event type
    if (event.type === 'SECURITY_EVENT') {
      if (filter.severities && filter.severities.length > 0 && !filter.severities.includes(event.severity)) {
        return false;
      }
      if (filter.assets && filter.assets.length > 0 && !filter.assets.includes((event as any).source)) {
         return false;
      }
    }

    if (event.type === 'AGENT_STATUS') {
       if (filter.agents && filter.agents.length > 0 && !filter.agents.includes(event.agentId)) {
         return false;
       }
    }

    return true;
  }
}
