import { RealtimeEvent } from '../types';
import { EventValidator } from './validator';
import { Deduplicator } from './deduplicator';
import { EventOrderer } from './orderer';
import { EventEnricher } from './enricher';
import { RateLimiter } from './rateLimiter';
import { ReplayBuffer } from './replayBuffer';
import { pipelineMetrics } from './metrics';
import { eventBus } from '../eventBus';

class EventPipeline {
  private deduplicator: Deduplicator;
  private orderer: EventOrderer;
  private rateLimiter: RateLimiter;
  private replayBuffer: ReplayBuffer;

  constructor() {
    this.deduplicator = new Deduplicator(1000);
    this.orderer = new EventOrderer(2000);
    this.rateLimiter = new RateLimiter(50, false); // 50ms rate limit, single release
    this.replayBuffer = new ReplayBuffer(100);
  }

  processRawEvent(rawPayload: any) {
    const startTime = Date.now();
    pipelineMetrics.recordReceived();

    // 1. Validation
    const validEvent = EventValidator.validate(rawPayload);
    if (!validEvent) return;

    // 2. Deduplication
    if (this.deduplicator.isDuplicate(validEvent)) return;

    // 3. Ordering
    this.orderer.process(validEvent, (orderedEvent) => {
      // 4. Enrichment
      const enrichedEvent = EventEnricher.enrich(orderedEvent);

      // 5. Rate Limiting & Final Dispatch
      this.rateLimiter.enqueue(enrichedEvent, (releasedEvent) => {
        if (Array.isArray(releasedEvent)) {
           // If batch mode was true
           releasedEvent.forEach(e => this.dispatchToBus(e, startTime));
        } else {
           this.dispatchToBus(releasedEvent, startTime);
        }
      });
    });
  }

  private dispatchToBus(event: RealtimeEvent, startTime: number) {
    // 6. Replay Buffer Storage
    this.replayBuffer.add(event);

    // 7. Publish to Bus
    eventBus.publish(event.type, event);

    // Record metrics
    const latency = Date.now() - startTime;
    pipelineMetrics.recordProcessed(latency);
  }

  getReplayBuffer() {
    return this.replayBuffer.getRecentEvents();
  }
}

export const eventPipeline = new EventPipeline();
