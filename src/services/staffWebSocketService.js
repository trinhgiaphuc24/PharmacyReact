class StaffWebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.isConnected = false;
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://127.0.0.1:8000/ws/staff-notifications/`;
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.isConnected = true;
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        };

        this.ws.onclose = () => {
          this.ws = null;
          this.isConnected = false;
        };

        this.ws.onerror = (error) => {
          this.isConnected = false;
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  handleMessage(data) {
    if (this.listeners.has('all')) {
      this.listeners.get('all').forEach(callback => callback(data));
    }
  }

  on(type, callback) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Set());
    }
    this.listeners.get(type).add(callback);
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
    this.isConnected = false;
  }
}

const staffWebSocketService = new StaffWebSocketService();
export default staffWebSocketService;
