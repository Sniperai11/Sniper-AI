import { ConnectionState } from './types';
import { eventBus } from './eventBus';

class ConnectionMonitor {
  private _state: ConnectionState = 'Disconnected';

  get state(): ConnectionState {
    return this._state;
  }

  setState(newState: ConnectionState) {
    if (this._state !== newState) {
      this._state = newState;
      eventBus.publish('CONNECTION_STATE_CHANGE', this._state);
    }
  }
}

// Global Singleton
export const connectionMonitor = new ConnectionMonitor();
