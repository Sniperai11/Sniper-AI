export type ConnectionState = 'Connecting' | 'Connected' | 'Disconnected' | 'Reconnecting' | 'Authentication Failed';

export interface BaseEvent {
  id: string; // Used for deduplication
  timestamp: number;
  sequence?: number; // Used for ordering out-of-order events
}

export interface SecurityEvent extends BaseEvent {
  type: 'SECURITY_EVENT';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  description: string;
  source: string;
}

export interface AgentStatus extends BaseEvent {
  type: 'AGENT_STATUS';
  agentId: string;
  status: 'Active' | 'Idle' | 'Error';
  currentTask?: string;
  cpuUsage?: number;
  memoryUsage?: number;
}

export interface IncidentUpdate extends BaseEvent {
  type: 'INCIDENT_UPDATE';
  incidentId: string;
  status: 'Open' | 'Investigating' | 'Resolved';
  updates: string;
}

export interface ThreatAlert extends BaseEvent {
  type: 'THREAT_ALERT';
  threatId: string;
  indicator: string;
  actionTaken: string;
}

export interface ScanProgress extends BaseEvent {
  type: 'SCAN_PROGRESS';
  scanId: string;
  progressPercentage: number;
  currentPhase: string;
  findingsCount: number;
}

export interface NotificationEvent extends BaseEvent {
  type: 'NOTIFICATION';
  title: string;
  message: string;
  read: boolean;
}

export type RealtimeEvent = 
  | SecurityEvent 
  | AgentStatus 
  | IncidentUpdate 
  | ThreatAlert 
  | ScanProgress 
  | NotificationEvent;

export interface WsMessage {
  event: string;
  channel?: string;
  payload: any;
}
