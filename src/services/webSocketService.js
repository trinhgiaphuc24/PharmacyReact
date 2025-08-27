class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.userId = null;
    this.connectionPromise = null;
  }

  connect(userId) {
    // Nếu đã có connection promise đang pending cho cùng user, return promise đó
    if (this.connectionPromise && this.userId === userId) {
      return this.connectionPromise;
    }
    
    // Nếu đã connected với cùng user, return resolved promise
    if (this.ws && this.ws.readyState === WebSocket.OPEN && this.userId === userId) {
      return Promise.resolve();
    }

    this.userId = userId;

    this.connectionPromise = new Promise((resolve, reject) => {
      try {
        const wsUrl = `ws://127.0.0.1:8000/ws/notifications/?user_id=${userId}`;
        
        // Đóng connection cũ nếu có
        if (this.ws) {
          this.ws.close();
        }
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          this.send({
            type: 'join_user_group',
            user_id: userId
          });
          this.connectionPromise = null;
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        };

        this.ws.onclose = () => {
          this.ws = null;
          this.connectionPromise = null;
        };

        this.ws.onerror = (error) => {
          this.connectionPromise = null;
          reject(error);
        };

      } catch (error) {
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
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
    
    // Thêm listener mới (Set tự động tránh duplicate)
    this.listeners.get(type).add(callback);
  }

  off(type, callback) {
    if (this.listeners.has(type)) {
      this.listeners.get(type).delete(callback);
    }
  }

  clearAllListeners() {
    this.listeners.clear();
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.clearAllListeners();
    this.userId = null;
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
