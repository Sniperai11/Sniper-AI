export interface IScanner {
  runScan(targetId: string, scanJobId: string): Promise<void>;
}
