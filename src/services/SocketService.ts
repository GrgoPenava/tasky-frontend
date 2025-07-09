import { io, Socket } from "socket.io-client";
import { ref } from "vue";
import { supabase } from "@/supabase/client";

interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    fullName: string;
  };
}

interface User {
  userId: string;
  email: string;
  name: string | null;
}

class SocketService {
  private socket: Socket | null = null;
  private isConnected = ref(false);
  private currentTaskId: string | null = null;
  private connectionPromise: Promise<void> | null = null;

  private readonly socketUrl = import.meta.env.VITE_API_SOCKET_URL;

  public async initialize(): Promise<void> {
    if (this.socket && this.isConnected.value) {
      console.log("Socket already initialized and connected");
      return;
    }

    if (this.connectionPromise) {
      console.log("Connection already in progress, waiting...");
      return this.connectionPromise;
    }

    this.connectionPromise = new Promise<void>((resolve, reject) => {
      try {
        if (this.socket && !this.isConnected.value) {
          this.socket.disconnect();
          this.socket = null;
        }

        supabase.auth
          .getSession()
          .then(({ data: sessionData }) => {
            const token = sessionData.session?.access_token;

            if (!token) {
              const error = new Error("Authentication token required");
              console.error("No authentication token available");
              reject(error);
              this.connectionPromise = null;
              return;
            }

            this.socket = io(this.socketUrl, {
              auth: { token },
              transports: ["websocket", "polling"],
            });

            console.log("Socket.IO connection initialized");

            this.socket.on("connect", () => {
              console.log("Socket connected:", this.socket?.id);
              this.isConnected.value = true;
              resolve();
              this.connectionPromise = null;
            });

            this.socket.on("connect_error", (error) => {
              console.error("Socket connection error:", error);
              reject(error);
              this.connectionPromise = null;
            });

            this.setupEventListeners();

            setTimeout(() => {
              if (!this.isConnected.value && this.connectionPromise) {
                const timeoutError = new Error("Socket connection timeout");
                console.error("Socket connection timeout");
                reject(timeoutError);
                this.connectionPromise = null;
              }
            }, 5000);
          })
          .catch((error) => {
            console.error("Failed to get session:", error);
            reject(error);
            this.connectionPromise = null;
          });
      } catch (error) {
        console.error("Failed to initialize socket connection:", error);
        reject(error);
        this.connectionPromise = null;
      }
    });

    return this.connectionPromise;
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("disconnect", (reason: string) => {
      console.log("Socket disconnected:", reason);
      this.isConnected.value = false;
    });

    this.socket.on("error", (error: any) => {
      console.error("Socket error:", error);
    });
  }

  public async joinTaskComments(
    taskId: string,
    onTaskComments: (comments: Comment[]) => void,
    onNewComment: (comment: Comment) => void
  ): Promise<void> {
    if (!this.socket || !this.isConnected.value) {
      await this.initialize();
    }

    if (!this.isConnected.value) {
      console.error("Socket not connected");
      throw new Error("Socket not connected");
    }

    if (this.currentTaskId) {
      this.leaveTaskComments();
    }

    this.currentTaskId = taskId;

    this.socket?.on("task-comments", (comments: Comment[]) => {
      console.log(`Received ${comments.length} comments for task ${taskId}`);
      onTaskComments(comments);
    });

    this.socket?.on("new-comment", (comment: Comment) => {
      console.log("New comment received:", comment);
      onNewComment(comment);
    });

    this.socket?.on("user-joined", (user: User) => {
      console.log("User joined the comments:", user);
    });

    this.socket?.on("user-left", (user: User) => {
      console.log("User left the comments:", user);
    });

    this.socket?.emit("join-task-comments", taskId);
    console.log(`Joined task comments for task ${taskId}`);
  }

  public leaveTaskComments(): void {
    if (!this.socket || !this.currentTaskId) return;

    this.socket.emit("leave-task-comments", this.currentTaskId);
    console.log(`Left task comments for task ${this.currentTaskId}`);

    this.socket.off("task-comments");
    this.socket.off("new-comment");
    this.socket.off("user-joined");
    this.socket.off("user-left");

    this.currentTaskId = null;
  }

  public addComment(taskId: string, content: string): void {
    if (!this.socket || !this.isConnected.value) {
      console.error("Socket not connected");
      throw new Error("Socket not connected");
    }

    this.socket.emit("add-comment", { taskId, content });
    console.log(`Comment sent for task ${taskId}`);
  }

  public disconnect(): void {
    if (this.currentTaskId) {
      this.leaveTaskComments();
    }

    this.socket?.disconnect();
    this.socket = null;
    this.isConnected.value = false;
    console.log("Socket disconnected");
  }

  public get connected(): boolean {
    return this.isConnected.value;
  }
}

const socketService = new SocketService();

export default socketService;
