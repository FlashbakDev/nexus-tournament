import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";

export const SOCKET_ACTIONS = {
  ADD_PARTICIPANT: "AddParticipant",
} as const;

export type SocketActionType =
  (typeof SOCKET_ACTIONS)[keyof typeof SOCKET_ACTIONS];

export type AddParticipantActionPayload = {
  tournamentId: string;
  name: string;
};

export type AddParticipantActionResult = {
  participant: ITournamentParticipantEntity;
  tournament: ITournamentEntity;
};

export type SocketActionPayloadMap = {
  [SOCKET_ACTIONS.ADD_PARTICIPANT]: AddParticipantActionPayload;
};

export type SocketActionResultMap = {
  [SOCKET_ACTIONS.ADD_PARTICIPANT]: AddParticipantActionResult;
};

export type SocketActionRequest<T extends SocketActionType = SocketActionType> =
  {
    type: T;
    payload: SocketActionPayloadMap[T];
  };

export type SocketActionSuccessResponse<
  T extends SocketActionType = SocketActionType,
> = {
  ok: true;
  type: T;
  data: SocketActionResultMap[T];
};

export type SocketActionErrorResponse = {
  ok: false;
  error: string;
};

export type SocketActionResponse<T extends SocketActionType = SocketActionType> =
  | SocketActionSuccessResponse<T>
  | SocketActionErrorResponse;
