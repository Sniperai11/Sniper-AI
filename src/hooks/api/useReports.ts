import { useQuery } from '@tanstack/react-query';
import { reportsService } from '../../api/services/reports';

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsService.getReports(),
  });
};
