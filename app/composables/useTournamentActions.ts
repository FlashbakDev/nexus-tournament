import {
  SOCKET_ACTIONS,
  type AddParticipantActionPayload,
  type AddParticipantActionResult,
  type DeleteParticipantActionPayload,
  type DeleteParticipantActionResult,
  type SetParticipantIsReadyActionPayload,
  type SetParticipantIsReadyActionResult,
  type SocketActionRequest,
  type SocketActionSuccessResponse,
  type SocketActionType,
  type UpdateParticipantActionPayload,
  type UpdateParticipantActionResult,
} from "~~/shared/realtime/actions";
import { SOCKET_EVENTS } from "~~/shared/realtime/events";
import { getSocket } from "~/utils/socket.client";

function dispatchAction<T extends SocketActionType>(
  request: SocketActionRequest<T>,
): Promise<SocketActionSuccessResponse<T>> {
  const socket = getSocket();

  return new Promise((resolve, reject) => {
    if (!socket.connected) {
      reject(new Error("Socket is not connected"));
      return;
    }

    socket.emit(SOCKET_EVENTS.TOURNAMENT_ACTION, request, (response) => {
      if (!response.ok) {
        reject(new Error(response.error));
        return;
      }
      resolve(response as SocketActionSuccessResponse<T>);
    });
  });
}

export function useTournamentActions() {
  async function addParticipant(
    payload: AddParticipantActionPayload,
  ): Promise<AddParticipantActionResult> {
    const response = await dispatchAction({
      type: SOCKET_ACTIONS.ADD_PARTICIPANT,
      payload,
    });
    return response.data;
  }

  async function updateParticipant(
    payload: UpdateParticipantActionPayload,
  ): Promise<UpdateParticipantActionResult> {
    const response = await dispatchAction({
      type: SOCKET_ACTIONS.UPDATE_PARTICIPANT,
      payload,
    });
    return response.data;
  }

  async function deleteParticipant(
    payload: DeleteParticipantActionPayload,
  ): Promise<DeleteParticipantActionResult> {
    const response = await dispatchAction({
      type: SOCKET_ACTIONS.DELETE_PARTICIPANT,
      payload,
    });
    return response.data;
  }

  async function setParticipantIsReady(
    payload: SetParticipantIsReadyActionPayload,
  ): Promise<SetParticipantIsReadyActionResult> {
    const response = await dispatchAction({
      type: SOCKET_ACTIONS.SET_PARTICIPANT_IS_READY,
      payload,
    });
    return response.data;
  }

  return {
    addParticipant,
    updateParticipant,
    deleteParticipant,
    setParticipantIsReady,
    dispatchAction,
  };
}
