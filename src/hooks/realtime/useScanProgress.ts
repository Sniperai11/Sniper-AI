import { ScanProgress } from '../../realtime/types';
import { useEffect, useState } from 'react';
import { eventBus } from '../../realtime/eventBus';

export function useScanProgress(scanId?: string) {
  const [progressMap, setProgressMap] = useState<Record<string, ScanProgress>>({});

  useEffect(() => {
    const unsubscribe = eventBus.subscribe<ScanProgress>('SCAN_PROGRESS', (progress) => {
      setProgressMap(prev => ({
        ...prev,
        [progress.scanId]: progress
      }));
    });

    return () => unsubscribe();
  }, []);

  // Return a single scan if an ID is provided, otherwise return the whole map
  if (scanId) {
    return progressMap[scanId] || null;
  }

  return progressMap;
}
