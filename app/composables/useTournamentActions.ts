import {
  SOCKET_ACTIONS,
  type AddParticipantActionPayload,
  type AddParticipantActionResult,
  type SocketActionRequest,
  type SocketActionResponse,
} from "~~/shared/realtime/actions";
import { SOCKET_EVENTS } from "~~/shared/realtime/events";
import { getSocket } from "~/utils/socket.client";

function dispatchAction<T extends SocketActionRequest>(
  request: T,
): Promise<Extract<SocketActionResponse, { ok: true; type: T["type"] }>> {
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
      resolve(
        response as Extract<
          SocketActionResponse,
          { ok: true; type: T["type"] }
        >,
      );
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

  return {
    addParticipant,
    dispatchAction,
  };
}
