import type { Server } from "socket.io";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "~~/shared/realtime/events";

export type AppSocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents
>;

let io: AppSocketServer | null = null;

export function setSocketIO(instance: AppSocketServer): void {
  io = instance;
}

export function getSocketIO(): AppSocketServer {
  if (!io) {
    throw new Error("Socket.IO server is not initialized");
  }
  return io;
}
