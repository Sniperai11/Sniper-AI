const fs = require('fs');

function processFile(path) {
  let content = fs.readFileSync(path, 'utf8');
  console.log('Processing', path);
  if (path.includes('commandCenter.ts')) {
    content = content.replace(/activeAssets: activeAssets \|\| 285/g, 'activeAssets: activeAssets || 0');
    content = content.replace(/totalVulnerabilities: totalVulnerabilities \|\| 12/g, 'totalVulnerabilities: totalVulnerabilities || 0');
    content = content.replace(/openIncidents: 4/g, 'openIncidents: 0');
    content = content.replace(/activeAgents: 5/g, 'activeAgents: 0');
    
    // Remove catch blocks that return mock data
    content = content.replace(/\} catch \{[\s\S]*?\n\s*return \{\n\s*success: true,[\s\S]*?\}\n\s*\}/g, '} catch (error) {\n    throw error;\n  }');
    
    // Fix logical ORs for fallbacks in getRiskTrend
    content = content.replace(/critical \|\| 5/g, 'critical || 0');
    content = content.replace(/high \|\| 14/g, 'high || 0');
    content = content.replace(/medium \|\| 30/g, 'medium || 0');
    
    // Fix logical ORs in getAssetDistribution
    content = content.replace(/web \|\| 120/g, 'web || 0');
    content = content.replace(/api \|\| 35/g, 'api || 0');
    content = content.replace(/mobile \|\| 45/g, 'mobile || 0');
    content = content.replace(/source \|\| 85/g, 'source || 0');
    
    // Fix logical ORs in getRecentAlerts
    content = content.replace(/alerts\.length > 0 \? alerts : \[[\s\S]*?\]/g, 'alerts');
  }
  
  if (path.includes('assets.ts')) {
    // Completely rewrite assets.ts
    content = `import { apiClient } from '../client';
import { AssetWorkflow } from '../types/workflows';

export const assetsService = {
  getAssets: async (params?: { search?: string; category?: string; risk?: string }): Promise<AssetWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/projects');
      const projects = Array.isArray(response) ? response : (response?.data || []);
      
      const extractedAssets: AssetWorkflow[] = [];
      if (Array.isArray(projects)) {
        projects.forEach((proj: any) => {
          if (Array.isArray(proj.targets)) {
            proj.targets.forEach((t: any) => {
              extractedAssets.push({
                id: t.id,
                name: t.name || t.url || 'Target Asset',
                type: t.type || 'Web App',
                category: t.category || 'Infrastructure',
                risk: t.risk || 'Medium',
                tags: t.tags || ['Verified'],
                owner: proj.name || 'SecOps Team',
                lastSeen: 'Just now',
                ipAddress: t.ipAddress || 'Unknown',
                environment: 'Production'
              });
            });
          }
        });
      }

      let allAssets = extractedAssets;
      if (params?.search) {
        const q = params.search.toLowerCase();
        allAssets = allAssets.filter(a => a.name.toLowerCase().includes(q) || a.id.toLowerCase().includes(q) || a.type.toLowerCase().includes(q));
      }
      if (params?.category) {
        allAssets = allAssets.filter(a => a.category === params.category);
      }
      if (params?.risk) {
        allAssets = allAssets.filter(a => a.risk === params.risk);
      }
      
      return allAssets;
    } catch (error) {
      throw error;
    }
  },
  
  getAssetById: async (id: string): Promise<AssetWorkflow> => {
    try {
      // Endpoint might not exist, but let's try
      const response = await apiClient.get<any>(\`/assets/\${id}\`);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },
  
  createAsset: async (data: Partial<AssetWorkflow>): Promise<AssetWorkflow> => {
    try {
      const response = await apiClient.post<any>('/assets', data);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },
  
  updateAsset: async (id: string, updates: Partial<AssetWorkflow>): Promise<AssetWorkflow> => {
    try {
      const response = await apiClient.patch<any>(\`/assets/\${id}\`, updates);
      return response.data || response;
    } catch (error) {
      throw error;
    }
  },
  
  deleteAsset: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(\`/assets/\${id}\`);
    } catch (error) {
      throw error;
    }
  }
};
`;
  }
  
  if (path.includes('tasks.ts')) {
    content = `import { apiClient } from '../client';
import { TaskWorkflow } from '../types/workflows';

export const tasksService = {
  getTasks: async (params?: { search?: string; status?: string; priority?: string }): Promise<TaskWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/remediations');
      let tasks = Array.isArray(response) ? response : (response?.data || []);
      
      if (params?.search) {
        const q = params.search.toLowerCase();
        tasks = tasks.filter((t: any) => t.title?.toLowerCase().includes(q) || t.id?.toLowerCase().includes(q));
      }
      if (params?.status) {
        tasks = tasks.filter((t: any) => t.status === params.status);
      }
      if (params?.priority) {
        tasks = tasks.filter((t: any) => t.priority === params.priority);
      }
      return tasks;
    } catch (error) {
      // Backend integration pending
      return [];
    }
  },
  
  getTaskById: async (id: string): Promise<TaskWorkflow> => {
    const response = await apiClient.get<any>(\`/remediations/\${id}\`);
    return response.data || response;
  },
  
  createTask: async (data: Partial<TaskWorkflow>): Promise<TaskWorkflow> => {
    const response = await apiClient.post<any>('/remediations', data);
    return response.data || response;
  },
  
  updateTaskStatus: async (id: string, status: TaskWorkflow['status']): Promise<TaskWorkflow> => {
    const response = await apiClient.patch<any>(\`/remediations/\${id}\`, { status });
    return response.data || response;
  },
  
  updateTask: async (id: string, updates: Partial<TaskWorkflow>): Promise<TaskWorkflow> => {
    const response = await apiClient.patch<any>(\`/remediations/\${id}\`, updates);
    return response.data || response;
  }
};
`;
  }
  
  if (path.includes('cases.ts')) {
    content = `import { apiClient } from '../client';
import { CaseWorkflow } from '../types/workflows';

export const casesService = {
  getCases: async (params?: { search?: string; status?: string; priority?: string }): Promise<CaseWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/cases');
      let cases = Array.isArray(response) ? response : (response?.data || []);
      if (params?.search) {
        const q = params.search.toLowerCase();
        cases = cases.filter((c: any) => c.title?.toLowerCase().includes(q) || c.id?.toLowerCase().includes(q));
      }
      if (params?.status) {
        cases = cases.filter((c: any) => c.status === params.status);
      }
      if (params?.priority) {
        cases = cases.filter((c: any) => c.severity === params.priority);
      }
      return cases;
    } catch (error) {
      // Backend integration pending
      return [];
    }
  },
  
  getCaseById: async (id: string): Promise<CaseWorkflow> => {
    const response = await apiClient.get<any>(\`/cases/\${id}\`);
    return response.data || response;
  },
  
  createCase: async (data: Partial<CaseWorkflow>): Promise<CaseWorkflow> => {
    const response = await apiClient.post<any>('/cases', data);
    return response.data || response;
  },
  
  updateCaseStatus: async (id: string, status: CaseWorkflow['status']): Promise<CaseWorkflow> => {
    const response = await apiClient.patch<any>(\`/cases/\${id}\`, { status });
    return response.data || response;
  },
  
  updateCase: async (id: string, updates: Partial<CaseWorkflow>): Promise<CaseWorkflow> => {
    const response = await apiClient.patch<any>(\`/cases/\${id}\`, updates);
    return response.data || response;
  }
};
`;
  }
  
  if (path.includes('incidents.ts')) {
    content = `import { apiClient } from '../client';
import { IncidentWorkflow } from '../types/workflows';

export const incidentsService = {
  getIncidents: async (params?: { search?: string; status?: string; severity?: string }): Promise<IncidentWorkflow[]> => {
    try {
      const response = await apiClient.get<any>('/incidents');
      let incidents = Array.isArray(response) ? response : (response?.data || []);
      
      if (params?.search) {
        const q = params.search.toLowerCase();
        incidents = incidents.filter((i: any) => i.title?.toLowerCase().includes(q) || i.id?.toLowerCase().includes(q));
      }
      if (params?.status) {
        incidents = incidents.filter((i: any) => i.status === params.status);
      }
      if (params?.severity) {
        incidents = incidents.filter((i: any) => i.severity === params.severity);
      }
      
      return incidents;
    } catch (error) {
      // Backend integration pending
      return [];
    }
  },
  
  getIncidentById: async (id: string): Promise<IncidentWorkflow> => {
    const response = await apiClient.get<any>(\`/incidents/\${id}\`);
    return response.data || response;
  },
  
  updateIncidentStatus: async (id: string, status: IncidentWorkflow['status']): Promise<IncidentWorkflow> => {
    const response = await apiClient.patch<any>(\`/incidents/\${id}\`, { status });
    return response.data || response;
  },
  
  updateIncident: async (id: string, updates: Partial<IncidentWorkflow>): Promise<IncidentWorkflow> => {
    const response = await apiClient.patch<any>(\`/incidents/\${id}\`, updates);
    return response.data || response;
  },
  
  createIncident: async (data: Partial<IncidentWorkflow>): Promise<IncidentWorkflow> => {
    const response = await apiClient.post<any>('/incidents', data);
    return response.data || response;
  }
};
`;
  }
  
  fs.writeFileSync(path, content, 'utf8');
}

['src/api/services/commandCenter.ts', 'src/api/services/assets.ts', 'src/api/services/tasks.ts', 'src/api/services/cases.ts', 'src/api/services/incidents.ts'].forEach(processFile);
