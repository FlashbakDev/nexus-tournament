import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";
import { SOCKET_EVENTS } from "~~/shared/realtime/events";
import { resetSocket } from "~/utils/socket.client";

export type UseTournamentRoomCallbacks = {
  onUpdated?: (tournament: ITournamentEntity) => void;
  onDeleted?: (payload: { id: string }) => void;
  onParticipantCreated?: (participant: ITournamentParticipantEntity) => void;
  onParticipantUpdated?: (participant: ITournamentParticipantEntity) => void;
  onParticipantDeleted?: (payload: {
    id: string;
    tournamentId: string;
  }) => void;
};

export function useTournamentRoom(
  tournamentId: Ref<string> | ComputedRef<string>,
  callbacks: UseTournamentRoomCallbacks = {},
) {
  const { socket, connect, disconnect, connected } = useSocket();

  const joinRoom = (id: string) => {
    socket.emit(SOCKET_EVENTS.TOURNAMENT_JOIN, id);
  };

  const leaveRoom = (id: string) => {
    socket.emit(SOCKET_EVENTS.TOURNAMENT_LEAVE, id);
  };

  const setupListeners = () => {
    if (callbacks.onUpdated) {
      socket.on(SOCKET_EVENTS.TOURNAMENT_UPDATED, callbacks.onUpdated);
    }
    if (callbacks.onDeleted) {
      socket.on(SOCKET_EVENTS.TOURNAMENT_DELETED, callbacks.onDeleted);
    }
    if (callbacks.onParticipantCreated) {
      socket.on(SOCKET_EVENTS.PARTICIPANT_CREATED, callbacks.onParticipantCreated);
    }
    if (callbacks.onParticipantUpdated) {
      socket.on(SOCKET_EVENTS.PARTICIPANT_UPDATED, callbacks.onParticipantUpdated);
    }
    if (callbacks.onParticipantDeleted) {
      socket.on(SOCKET_EVENTS.PARTICIPANT_DELETED, callbacks.onParticipantDeleted);
    }
  };

  const teardownListeners = () => {
    socket.off(SOCKET_EVENTS.TOURNAMENT_UPDATED);
    socket.off(SOCKET_EVENTS.TOURNAMENT_DELETED);
    socket.off(SOCKET_EVENTS.PARTICIPANT_CREATED);
    socket.off(SOCKET_EVENTS.PARTICIPANT_UPDATED);
    socket.off(SOCKET_EVENTS.PARTICIPANT_DELETED);
  };

  const syncRoom = async (id: string) => {
    await connect();
    joinRoom(id);
  };

  onMounted(() => {
    setupListeners();
    const id = toValue(tournamentId);
    if (id) {
      syncRoom(id);
    }
  });

  watch(tournamentId, async (newId, oldId) => {
    if (oldId) {
      leaveRoom(oldId);
    }
    if (newId) {
      await syncRoom(newId);
    }
  });

  onUnmounted(() => {
    const id = toValue(tournamentId);
    if (id) {
      leaveRoom(id);
    }
    teardownListeners();
    disconnect();
    resetSocket();
  });

  return {
    socket,
    connected,
  };
}
