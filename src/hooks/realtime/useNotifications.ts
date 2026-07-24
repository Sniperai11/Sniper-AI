import { NotificationEvent } from '../../realtime/types';
import { useEffect, useState } from 'react';
import { eventBus } from '../../realtime/eventBus';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationEvent[]>([]);

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<NotificationEvent>('NOTIFICATION', (notification) => {
      setNotifications(prev => {
        const exists = prev.some(n => n.id === notification.id);
        if (exists) return prev;
        
        // Keep the latest 20 notifications
        return [notification, ...prev].slice(0, 20);
      });
    });

    return () => unsubscribe();
  }, []);

  return notifications;
}
