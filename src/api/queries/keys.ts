// Centralized Query Key Factory
export const queryKeys = {
  commandCenter: {
    all: ['commandCenter'] as const,
    systemStats: () => [...queryKeys.commandCenter.all, 'systemStats'] as const,
    riskTrend: () => [...queryKeys.commandCenter.all, 'riskTrend'] as const,
    assetDistribution: () => [...queryKeys.commandCenter.all, 'assetDistribution'] as const,
    recentAlerts: () => [...queryKeys.commandCenter.all, 'recentAlerts'] as const,
  },
  assets: {
    all: ['assets'] as const,
    list: (filters?: Record<string, any>) => [...queryKeys.assets.all, { filters }] as const,
    detail: (id: string) => [...queryKeys.assets.all, id] as const,
  },
  // Add more module keys here...
};
