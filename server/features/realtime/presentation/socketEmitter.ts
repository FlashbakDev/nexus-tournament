import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";
import { getSocketIO } from "~~/server/utils/socket";
import {
  SOCKET_EVENTS,
  tournamentRoom,
  type ParticipantDeletedPayload,
  type TournamentDeletedPayload,
} from "~~/shared/realtime/events";

export function emitTournamentUpdated(tournament: ITournamentEntity): void {
  getSocketIO()
    .to(tournamentRoom(tournament.id))
    .emit(SOCKET_EVENTS.TOURNAMENT_UPDATED, tournament);
}

export function emitTournamentDeleted(payload: TournamentDeletedPayload): void {
  getSocketIO()
    .to(tournamentRoom(payload.id))
    .emit(SOCKET_EVENTS.TOURNAMENT_DELETED, payload);
}

export function emitParticipantCreated(
  participant: ITournamentParticipantEntity,
): void {
  getSocketIO()
    .to(tournamentRoom(participant.tournamentId))
    .emit(SOCKET_EVENTS.PARTICIPANT_CREATED, participant);
}

export function emitParticipantUpdated(
  participant: ITournamentParticipantEntity,
): void {
  getSocketIO()
    .to(tournamentRoom(participant.tournamentId))
    .emit(SOCKET_EVENTS.PARTICIPANT_UPDATED, participant);
}

export function emitParticipantDeleted(
  payload: ParticipantDeletedPayload,
): void {
  getSocketIO()
    .to(tournamentRoom(payload.tournamentId))
    .emit(SOCKET_EVENTS.PARTICIPANT_DELETED, payload);
}
