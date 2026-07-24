import { SecurityEvent } from '../../realtime/types';
import { useEffect, useState } from 'react';
import { eventBus } from '../../realtime/eventBus';

export function useSecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<SecurityEvent>('SECURITY_EVENT', (event) => {
      setEvents(prev => {
        // Redundant deduplication just in case
        const exists = prev.some(e => e.id === event.id);
        if (exists) return prev;
        
        // Keep the latest 10000 events
        return [event, ...prev].slice(0, 10000);
      });
    });

    return () => unsubscribe();
  }, []);

  return events;
}
