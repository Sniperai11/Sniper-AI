import { RealtimeEvent } from '../types';

export class ReplayBuffer {
  private buffer: RealtimeEvent[] = [];
  private readonly maxBufferSize: number;

  constructor(maxBufferSize: number = 50) {
    this.maxBufferSize = maxBufferSize;
  }

  add(event: RealtimeEvent) {
    this.buffer.push(event);
    if (this.buffer.length > this.maxBufferSize) {
      this.buffer.shift();
    }
  }

  getRecentEvents(): RealtimeEvent[] {
    return [...this.buffer];
  }
}
