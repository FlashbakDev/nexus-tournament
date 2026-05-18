import type { AppSocketServer } from "~~/server/utils/socket";
import {
  SOCKET_EVENTS,
  tournamentRoom,
} from "~~/shared/realtime/events";
import { tournamentIdParamSchema } from "~~/server/features/tournament/presentation/params";

export function registerSocketHandlers(io: AppSocketServer): void {
  io.on("connection", (socket) => {
    socket.on(SOCKET_EVENTS.TOURNAMENT_JOIN, (tournamentId) => {
      const result = tournamentIdParamSchema.safeParse({ id: tournamentId });
      if (!result.success) {
        return;
      }
      socket.join(tournamentRoom(result.data.id));
    });

    socket.on(SOCKET_EVENTS.TOURNAMENT_LEAVE, (tournamentId) => {
      const result = tournamentIdParamSchema.safeParse({ id: tournamentId });
      if (!result.success) {
        return;
      }
      socket.leave(tournamentRoom(result.data.id));
    });
  });
}
