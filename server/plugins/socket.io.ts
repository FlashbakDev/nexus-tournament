import type { NitroApp } from "nitropack";
import { Server as Engine } from "engine.io";
import { Server } from "socket.io";
import { defineEventHandler } from "h3";
import { setSocketIO, type AppSocketServer } from "~~/server/utils/socket";
import { registerSocketHandlers } from "~~/server/features/realtime/presentation/socketHandlers";
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from "~~/shared/realtime/events";

export default defineNitroPlugin((nitroApp: NitroApp) => {
  const engine = new Engine();
  const io = new Server<ClientToServerEvents, ServerToClientEvents>();
  io.bind(engine);

  setSocketIO(io as AppSocketServer);
  registerSocketHandlers(io as AppSocketServer);

  nitroApp.router.use(
    "/socket.io/",
    defineEventHandler({
      handler(event) {
        engine.handleRequest(event.node.req, event.node.res);
        event._handled = true;
      },
      websocket: {
        open(peer) {
          // @ts-expect-error private Engine.io internals
          engine.prepare(peer._internal.nodeReq);
          // @ts-expect-error private Engine.io internals
          engine.onWebSocket(
            peer._internal.nodeReq,
            peer._internal.nodeReq.socket,
            peer.websocket,
          );
        },
      },
    }),
  );
});
