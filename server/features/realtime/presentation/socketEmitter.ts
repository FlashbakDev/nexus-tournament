import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";
import { getSocketIO } from "~~/server/utils/socket";
import {
  SOCKET_EVENTS,
  tournamentRoom,
  type ParticipantDeletedPayload,
  type TournamentDeletedPayload,
} from "~~/shared/realtime/events";
import { logSocketEmit } from "./socketLogger";

function emitToRoom(
  event: string,
  room: string,
  payload: unknown,
): void {
  logSocketEmit(event, room, payload);
  getSocketIO().to(room).emit(event, payload);
}

export function emitTournamentUpdated(tournament: ITournamentEntity): void {
  const room = tournamentRoom(tournament.id);
  emitToRoom(SOCKET_EVENTS.TOURNAMENT_UPDATED, room, tournament);
}

export function emitTournamentDeleted(payload: TournamentDeletedPayload): void {
  const room = tournamentRoom(payload.id);
  emitToRoom(SOCKET_EVENTS.TOURNAMENT_DELETED, room, payload);
}

export function emitParticipantCreated(
  participant: ITournamentParticipantEntity,
): void {
  const room = tournamentRoom(participant.tournamentId);
  emitToRoom(SOCKET_EVENTS.PARTICIPANT_CREATED, room, participant);
}

export function emitParticipantUpdated(
  participant: ITournamentParticipantEntity,
): void {
  const room = tournamentRoom(participant.tournamentId);
  emitToRoom(SOCKET_EVENTS.PARTICIPANT_UPDATED, room, participant);
}

export function emitParticipantDeleted(
  payload: ParticipantDeletedPayload,
): void {
  const room = tournamentRoom(payload.tournamentId);
  emitToRoom(SOCKET_EVENTS.PARTICIPANT_DELETED, room, payload);
}
