import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";

export const SOCKET_EVENTS = {
  TOURNAMENT_JOIN: "tournament:join",
  TOURNAMENT_LEAVE: "tournament:leave",
  TOURNAMENT_UPDATED: "tournament:updated",
  TOURNAMENT_DELETED: "tournament:deleted",
  PARTICIPANT_CREATED: "participant:created",
  PARTICIPANT_UPDATED: "participant:updated",
  PARTICIPANT_DELETED: "participant:deleted",
} as const;

export type SocketEventName =
  (typeof SOCKET_EVENTS)[keyof typeof SOCKET_EVENTS];

export type TournamentDeletedPayload = {
  id: string;
};

export type ParticipantDeletedPayload = {
  id: string;
  tournamentId: string;
};

export interface ServerToClientEvents {
  [SOCKET_EVENTS.TOURNAMENT_UPDATED]: (payload: ITournamentEntity) => void;
  [SOCKET_EVENTS.TOURNAMENT_DELETED]: (payload: TournamentDeletedPayload) => void;
  [SOCKET_EVENTS.PARTICIPANT_CREATED]: (
    payload: ITournamentParticipantEntity,
  ) => void;
  [SOCKET_EVENTS.PARTICIPANT_UPDATED]: (
    payload: ITournamentParticipantEntity,
  ) => void;
  [SOCKET_EVENTS.PARTICIPANT_DELETED]: (
    payload: ParticipantDeletedPayload,
  ) => void;
}

export interface ClientToServerEvents {
  [SOCKET_EVENTS.TOURNAMENT_JOIN]: (tournamentId: string) => void;
  [SOCKET_EVENTS.TOURNAMENT_LEAVE]: (tournamentId: string) => void;
}

export function tournamentRoom(tournamentId: string): string {
  return `tournament:${tournamentId}`;
}
