export const Channels = {
  GLOBAL: 'global',
  SECURITY_ALERTS: 'security:alerts',
  AGENT_TELEMETRY: 'agents:telemetry',
  SCAN_UPDATES: 'scans:updates',
  INCIDENT_RESPONSE: 'incidents:response',
  NOTIFICATIONS: 'user:notifications'
} as const;

export type ChannelName = typeof Channels[keyof typeof Channels];
