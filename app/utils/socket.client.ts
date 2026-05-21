import { io, type Socket } from "socket.io-client";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "~~/shared/realtime/events";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export function getSocket(): Socket<
  ServerToClientEvents,
  ClientToServerEvents
> {
  if (!socket) {
    socket = io({
      autoConnect: false,
      path: "/socket.io/",
      transports: ["websocket"],
    });
  }
  return socket;
}

export function resetSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}
