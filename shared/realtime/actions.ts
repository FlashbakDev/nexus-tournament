import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";
import type { ParticipantActionPayload } from "~~/shared/realtime/participantPayload";

export const SOCKET_ACTIONS = {
  ADD_PARTICIPANT: "AddParticipant",
  UPDATE_PARTICIPANT: "UpdateParticipant",
  DELETE_PARTICIPANT: "DeleteParticipant",
  SET_PARTICIPANT_IS_READY: "SetParticipantIsReady",
} as const;

export type SocketActionType =
  (typeof SOCKET_ACTIONS)[keyof typeof SOCKET_ACTIONS];

export type AddParticipantActionPayload = {
  tournamentId: string;
  name: string;
};

export type UpdateParticipantActionPayload = ParticipantActionPayload;

export type DeleteParticipantActionPayload = ParticipantActionPayload;

export type SetParticipantIsReadyActionPayload = {
  participant: Pick<
    ITournamentParticipantEntity,
    "id" | "tournamentId"
  >;
  isReady: boolean;
};

export type ParticipantMutationActionResult = {
  tournament: ITournamentEntity;
};

export type AddParticipantActionResult = ParticipantMutationActionResult & {
  participant: ITournamentParticipantEntity;
};

export type UpdateParticipantActionResult = ParticipantMutationActionResult & {
  participant: ITournamentParticipantEntity;
};

export type SetParticipantIsReadyActionResult =
  ParticipantMutationActionResult & {
    participant: ITournamentParticipantEntity;
  };

export type DeleteParticipantActionResult = ParticipantMutationActionResult & {
  participantId: string;
  tournamentId: string;
};

export type SocketActionPayloadMap = {
  [SOCKET_ACTIONS.ADD_PARTICIPANT]: AddParticipantActionPayload;
  [SOCKET_ACTIONS.UPDATE_PARTICIPANT]: UpdateParticipantActionPayload;
  [SOCKET_ACTIONS.DELETE_PARTICIPANT]: DeleteParticipantActionPayload;
  [SOCKET_ACTIONS.SET_PARTICIPANT_IS_READY]: SetParticipantIsReadyActionPayload;
};

export type SocketActionResultMap = {
  [SOCKET_ACTIONS.ADD_PARTICIPANT]: AddParticipantActionResult;
  [SOCKET_ACTIONS.UPDATE_PARTICIPANT]: UpdateParticipantActionResult;
  [SOCKET_ACTIONS.DELETE_PARTICIPANT]: DeleteParticipantActionResult;
  [SOCKET_ACTIONS.SET_PARTICIPANT_IS_READY]: SetParticipantIsReadyActionResult;
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
