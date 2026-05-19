import type { AppSocketServer } from "~~/server/utils/socket";
import {
  SOCKET_EVENTS,
  tournamentRoom,
} from "~~/shared/realtime/events";
import { tournamentIdParamSchema } from "~~/server/features/tournament/presentation/params";
import { executeSocketAction } from "./socketActionRouter";
import {
  logSocketConnection,
  logSocketEmit,
  logSocketReceive,
} from "./socketLogger";

export function registerSocketHandlers(io: AppSocketServer): void {
  io.on("connection", (socket) => {
    logSocketConnection("connect", socket.id);

    socket.on("disconnect", () => {
      logSocketConnection("disconnect", socket.id);
    });

    socket.on(SOCKET_EVENTS.TOURNAMENT_ACTION, async (request, callback) => {
      logSocketReceive(SOCKET_EVENTS.TOURNAMENT_ACTION, socket.id, request);
      const response = await executeSocketAction(request);
      logSocketEmit(
        `${SOCKET_EVENTS.TOURNAMENT_ACTION}:ack`,
        `socket:${socket.id}`,
        response,
      );
      callback(response);
    });

    socket.on(SOCKET_EVENTS.TOURNAMENT_JOIN, (tournamentId) => {
      logSocketReceive(SOCKET_EVENTS.TOURNAMENT_JOIN, socket.id, {
        tournamentId,
      });
      const result = tournamentIdParamSchema.safeParse({ id: tournamentId });
      if (!result.success) {
        return;
      }
      const room = tournamentRoom(result.data.id);
      socket.join(room);
      logSocketEmit("room:joined", room, { socketId: socket.id });
    });

    socket.on(SOCKET_EVENTS.TOURNAMENT_LEAVE, (tournamentId) => {
      logSocketReceive(SOCKET_EVENTS.TOURNAMENT_LEAVE, socket.id, {
        tournamentId,
      });
      const result = tournamentIdParamSchema.safeParse({ id: tournamentId });
      if (!result.success) {
        return;
      }
      const room = tournamentRoom(result.data.id);
      socket.leave(room);
      logSocketEmit("room:left", room, { socketId: socket.id });
    });
  });
}
