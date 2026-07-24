import { RealtimeEvent } from '../types';
import { Logger } from '../../api/utils/logger';

export class EventOrderer {
  private eventBuffer: RealtimeEvent[] = [];
  private lastProcessedSequence: number = 0;
  private readonly maxBufferTimeMs: number;

  constructor(maxBufferTimeMs: number = 2000) {
    this.maxBufferTimeMs = maxBufferTimeMs;
  }

  process(event: RealtimeEvent, onOrdered: (evt: RealtimeEvent) => void) {
    // If no sequence is provided, pass through immediately
    if (event.sequence === undefined) {
      onOrdered(event);
      return;
    }

    if (event.sequence <= this.lastProcessedSequence) {
      Logger.debug(`[EventOrderer] Received old event ${event.sequence}, skipping or processing as out-of-order`);
      // Depending on strictness, we might drop or still process
      onOrdered(event);
      return;
    }

    if (event.sequence === this.lastProcessedSequence + 1) {
      this.lastProcessedSequence = event.sequence;
      onOrdered(event);
      this.flushBuffer(onOrdered);
    } else {
      // Out of order (gap detected), buffer it
      this.eventBuffer.push(event);
      this.eventBuffer.sort((a, b) => (a.sequence || 0) - (b.sequence || 0));

      // Force flush after timeout to prevent infinite hangs
      setTimeout(() => {
        this.forceFlush(event.sequence!, onOrdered);
      }, this.maxBufferTimeMs);
    }
  }

  private flushBuffer(onOrdered: (evt: RealtimeEvent) => void) {
    while (this.eventBuffer.length > 0 && this.eventBuffer[0].sequence === this.lastProcessedSequence + 1) {
      const nextEvent = this.eventBuffer.shift()!;
      this.lastProcessedSequence = nextEvent.sequence!;
      onOrdered(nextEvent);
    }
  }

  private forceFlush(upToSequence: number, onOrdered: (evt: RealtimeEvent) => void) {
    while (this.eventBuffer.length > 0 && this.eventBuffer[0].sequence! <= upToSequence) {
      const nextEvent = this.eventBuffer.shift()!;
      this.lastProcessedSequence = Math.max(this.lastProcessedSequence, nextEvent.sequence!);
      onOrdered(nextEvent);
    }
  }
}
