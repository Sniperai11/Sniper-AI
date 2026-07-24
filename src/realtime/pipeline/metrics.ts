import { PipelineMetrics } from './types';

class MetricsTracker {
  private metrics: PipelineMetrics = {
    eventsReceived: 0,
    eventsProcessed: 0,
    eventsDropped: 0,
    eventsDuplicated: 0,
    reconnectCount: 0,
    averageLatencyMs: 0,
    eventsPerSecond: 0,
  };

  private lastEpsCalculateTime = Date.now();
  private eventsSinceLastCalc = 0;
  private totalLatency = 0;
  private latencyMeasurements = 0;

  recordReceived() {
    this.metrics.eventsReceived++;
    this.eventsSinceLastCalc++;
    this.calculateEPS();
  }

  recordProcessed(latencyMs: number) {
    this.metrics.eventsProcessed++;
    this.totalLatency += latencyMs;
    this.latencyMeasurements++;
    this.metrics.averageLatencyMs = this.totalLatency / this.latencyMeasurements;
  }

  recordDropped() {
    this.metrics.eventsDropped++;
  }

  recordDuplicate() {
    this.metrics.eventsDuplicated++;
  }

  recordReconnect() {
    this.metrics.reconnectCount++;
  }

  getMetrics(): PipelineMetrics {
    return { ...this.metrics };
  }

  private calculateEPS() {
    const now = Date.now();
    const elapsed = now - this.lastEpsCalculateTime;
    if (elapsed >= 1000) {
      this.metrics.eventsPerSecond = (this.eventsSinceLastCalc / elapsed) * 1000;
      this.eventsSinceLastCalc = 0;
      this.lastEpsCalculateTime = now;
    }
  }
}

export const pipelineMetrics = new MetricsTracker();
