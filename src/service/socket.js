import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    this.socket = io(import.meta.env.VITE_SERVER_URL, {
      auth: {
        token: token,
      },
      autoConnect: false, // connect manually
    });

    this.setupEventListener();
    this.socket.connect();

    return this.socket;
  }

  setupEventListener() {
    this.socket.on("connect", () => {
      console.log("User connect to server");
      this.isConnected = true;

      //join all conver participated
      this.socket.emit("join_conversations");
    });

    this.socket.on("disconnect", () => {
      console.log("User disconnect to server");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (err) => {
      console.log("Connect error: ", err.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // emit method
  createConversation(
    { title = "", type = "DIRECT", profileUrl = "", allMemberIds } = {},
    callback
  ) {
    if (this.socket) {
      this.socket.emit(
        "create_conversation",
        { title, type, profileUrl, allMemberIds },
        callback
      );
    }
  }

  sendMessage(data) {
    if (this.socket) {
      this.socket.emit("send_message", {
        type: data.type || "TEXT",
        content: data.content,
        conversationId: data.conversationId,
      });
    }
  }

  // event listener
  onNewConversation(callback) {
    if (this.socket) {
      this.socket.on("new_conversation", callback);
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new_message", callback);
    }
  }

  onOnlineUserList(callback) {
    if (this.socket) {
      this.socket.on("online_users_list", callback);
    }
  }

  onUserOnline(callback) {
    if (this.socket) {
      this.socket.on("user_online", callback);
    }
  }

  onUserOffline(callback) {
    if (this.socket) {
      this.socket.on("user_offline", callback);
    }
  }

  off(event, callback) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }
}

export default new SocketService();
