export interface NormalizedVuln {
  tool: string;
  title: string;
  type: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  cvssScore: number;
  cwe?: string;
  owasp?: string;
  location: string;
  description: string;
  impact: string;
  remediation: string;
  evidence?: string;
  references?: string[];
}

export interface IScannerPlugin {
  readonly id: string;
  readonly name: string;
  
  initialize(): Promise<void>;
  validateTarget(url: string, type: string): boolean;
  execute(url: string, type: string, logsCallback: (msg: string) => void): Promise<any[]>;
  parseResults(rawResults: any[]): Promise<any[]>;
  normalize(parsedResults: any[]): Promise<NormalizedVuln[]>;
  cleanup(): Promise<void>;
}
