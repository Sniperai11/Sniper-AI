import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reportsService } from '../../api/services/reports';

export const useReports = () => {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsService.getReports(),
  });
};

export const useReportProjects = () => {
  return useQuery({
    queryKey: ['report-projects'],
    queryFn: () => reportsService.getProjects(),
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId?: string) => reportsService.generateReport(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reports'] });
    },
  });
};
