import { SecurityEvent } from '../../realtime/types';
import { useEffect, useState } from 'react';
import { eventBus } from '../../realtime/eventBus';
import { apiClient } from '../../api/client';

export function useSecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    // Fetch initial events from backend audit logs so live feed is immediately populated with real database entries
    apiClient.get<any>('/audit-logs').then((res) => {
      const logs = Array.isArray(res) ? res : (res?.data || []);
      if (logs.length > 0) {
        const mapped: SecurityEvent[] = logs.map((l: any) => ({
          id: l.id || `evt-${Math.random()}`,
          timestamp: l.timestamp ? new Date(l.timestamp).getTime() : Date.now(),
          type: 'SECURITY_EVENT',
          severity: l.action?.includes('حذف') || l.action?.includes('ثغرة') ? 'High' : 'Medium',
          description: l.details || l.action || 'العملية الأمنية المسجلة',
          source: l.userEmail || 'محرّك النظام'
        }));
        setEvents(prev => prev.length === 0 ? mapped : prev);
      }
    }).catch(() => {});

    const unsubscribe = eventBus.subscribe<SecurityEvent>('SECURITY_EVENT', (event) => {
      setEvents(prev => {
        const exists = prev.some(e => e.id === event.id);
        if (exists) return prev;
        return [event, ...prev].slice(0, 10000);
      });
    });

    return () => unsubscribe();
  }, []);

  return events;
}
