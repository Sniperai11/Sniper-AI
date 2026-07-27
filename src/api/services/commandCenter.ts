import { apiClient } from '../client';
import { ApiResponse, SystemStats, RiskTrendEntry, AssetDistributionEntry, AlertEntry } from '../types';

export const getSystemStats = async (): Promise<ApiResponse<SystemStats>> => {
  try {
    const res: any = await apiClient.get<any>('/command-center/stats');
    const data = res?.data || res;
    return {
      success: true,
      message: res?.message || 'Stats retrieved',
      data: {
        activeAssets: data?.activeAssets ?? 0,
        totalVulnerabilities: data?.totalVulnerabilities ?? 0,
        openIncidents: data?.openIncidents ?? 0,
        activeAgents: data?.activeAgents ?? 0,
        riskScore: data?.riskScore ?? 0,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching stats',
      data: {
        activeAssets: 0,
        totalVulnerabilities: 0,
        openIncidents: 0,
        activeAgents: 0,
        riskScore: 0,
      },
    };
  }
};

export const getRiskTrend = async (): Promise<ApiResponse<RiskTrendEntry[]>> => {
  try {
    const res: any = await apiClient.get<any>('/command-center/trend');
    const data = res?.data || res;
    return {
      success: true,
      message: res?.message || 'Trend retrieved',
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching risk trend',
      data: [],
    };
  }
};

export const getAssetDistribution = async (): Promise<ApiResponse<AssetDistributionEntry[]>> => {
  try {
    const res: any = await apiClient.get<any>('/command-center/distribution');
    const data = res?.data || res;
    return {
      success: true,
      message: res?.message || 'Distribution retrieved',
      data: Array.isArray(data) ? data : [],
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching asset distribution',
      data: [],
    };
  }
};

export const getRecentAlerts = async (): Promise<ApiResponse<AlertEntry[]>> => {
  try {
    const res: any = await apiClient.get<any>('/command-center/alerts');
    const data = res?.data || res;
    const alerts = Array.isArray(data) ? data : [];
    return {
      success: true,
      message: res?.message || 'Alerts retrieved',
      data: alerts.map((a: any) => ({
        id: a.id || 'VULN-0',
        severity: a.severity || 'Medium',
        asset: a.asset || a.targetName || 'System Target',
        type: a.type || a.title || 'Vulnerability Discovered',
        time: a.time || 'Recently',
        status: a.status || (a.isFalsePositive ? 'False Positive' : 'Open'),
        risk: Number(a.risk || a.cvssScore) || 5.0
      })),
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error fetching recent alerts',
      data: [],
    };
  }
};
