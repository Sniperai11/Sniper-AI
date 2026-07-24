import { useEffect, useState } from 'react';
import { eventBus } from '../../realtime/eventBus';
import { connectionMonitor } from '../../realtime/connectionMonitor';
import { ConnectionState, RealtimeEvent } from '../../realtime/types';

export function useRealtime<T extends RealtimeEvent>(eventType: T['type']) {
  const [lastEvent, setLastEvent] = useState<T | null>(null);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<T>(eventType, (payload) => {
      setLastEvent(payload);
    });

    return () => {
      unsubscribe();
    };
  }, [eventType]);

  return lastEvent;
}

export function useConnectionState() {
  const [state, setState] = useState<ConnectionState>(connectionMonitor.state);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<ConnectionState>('CONNECTION_STATE_CHANGE', (newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}
