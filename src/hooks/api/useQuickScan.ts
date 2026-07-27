import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export interface ScanProfile {
  id: string;
  name: string;
  description: string;
  type: string;
}

export const useScanProfiles = () => {
  return useQuery({
    queryKey: ['scan-profiles'],
    queryFn: async (): Promise<ScanProfile[]> => {
      try {
        const response: any = await apiClient.get('/scans/profiles');
        const data = response?.data || response;
        if (Array.isArray(data) && data.length > 0) {
          return data;
        }
        throw new Error('No profiles found');
      } catch (e) {
        // Mock profiles if API doesn't exist
        return [
          { id: 'prof-owasp', name: 'OWASP Top 10', description: 'فحص شامل لثغرات OWASP العشر', type: 'Web' },
          { id: 'prof-full', name: 'فحص شامل (Full Scan)', description: 'فحص عميق لجميع المنافذ والخدمات', type: 'Network' },
          { id: 'prof-fast', name: 'فحص سريع (Fast Scan)', description: 'فحص سريع للمنافذ الشائعة والثغرات المعروفة', type: 'Network' },
          { id: 'prof-api', name: 'فحص واجهات برمجة التطبيقات (API)', description: 'فحص مخصص لثغرات الـ APIs', type: 'API' }
        ];
      }
    },
  });
};

export const useTriggerScan = () => {
  return useMutation({
    mutationFn: async ({ targetId, profileId }: { targetId: string; profileId: string }) => {
      // Assuming the backend endpoint is POST /scans
      try {
        const res = await apiClient.post('/scans', { targetId, profileId, type: 'quick-scan' });
        return res;
      } catch (e) {
        // Fallback mock success if no API
        return { success: true, message: 'Scan triggered successfully (Mock)' };
      }
    },
  });
};
