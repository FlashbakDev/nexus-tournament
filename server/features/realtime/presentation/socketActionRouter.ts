import { z } from "zod";
import { tournamentIdParamSchema } from "~~/server/features/tournament/presentation/params";
import { CreateTournamentParticipantParamsSchema } from "~~/server/features/tournamentParticipant/presentation/params";
import {
  SOCKET_ACTIONS,
  type SocketActionRequest,
  type SocketActionResponse,
} from "~~/shared/realtime/actions";
import { tournamentParticipantEntitySchema } from "~~/shared/realtime/participantPayload";
import { getRealtimeActionProviderInstance } from "./providers/realtimeAction.provider.factory";

const addParticipantPayloadSchema = z.object({
  tournamentId: tournamentIdParamSchema.shape.id,
  name: CreateTournamentParticipantParamsSchema.shape.name,
});

const participantActionPayloadSchema = z.object({
  participant: tournamentParticipantEntitySchema,
});

const setParticipantIsReadyPayloadSchema = z.object({
  participant: tournamentParticipantEntitySchema.pick({
    id: true,
    tournamentId: true,
  }),
  isReady: z.boolean(),
});

const actionRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(SOCKET_ACTIONS.ADD_PARTICIPANT),
    payload: addParticipantPayloadSchema,
  }),
  z.object({
    type: z.literal(SOCKET_ACTIONS.UPDATE_PARTICIPANT),
    payload: participantActionPayloadSchema,
  }),
  z.object({
    type: z.literal(SOCKET_ACTIONS.DELETE_PARTICIPANT),
    payload: participantActionPayloadSchema,
  }),
  z.object({
    type: z.literal(SOCKET_ACTIONS.SET_PARTICIPANT_IS_READY),
    payload: setParticipantIsReadyPayloadSchema,
  }),
]);

export async function executeSocketAction(
  request: SocketActionRequest,
): Promise<SocketActionResponse> {
  const parsed = actionRequestSchema.safeParse(request);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.message };
  }

  const provider = await getRealtimeActionProviderInstance();

  try {
    switch (parsed.data.type) {
      case SOCKET_ACTIONS.ADD_PARTICIPANT: {
        const data = await provider.addParticipant(parsed.data.payload);
        return {
          ok: true,
          type: SOCKET_ACTIONS.ADD_PARTICIPANT,
          data,
        };
      }
      case SOCKET_ACTIONS.UPDATE_PARTICIPANT: {
        const data = await provider.updateParticipant(parsed.data.payload);
        return {
          ok: true,
          type: SOCKET_ACTIONS.UPDATE_PARTICIPANT,
          data,
        };
      }
      case SOCKET_ACTIONS.DELETE_PARTICIPANT: {
        const data = await provider.deleteParticipant(parsed.data.payload);
        return {
          ok: true,
          type: SOCKET_ACTIONS.DELETE_PARTICIPANT,
          data,
        };
      }
      case SOCKET_ACTIONS.SET_PARTICIPANT_IS_READY: {
        const data = await provider.setParticipantIsReady(parsed.data.payload);
        return {
          ok: true,
          type: SOCKET_ACTIONS.SET_PARTICIPANT_IS_READY,
          data,
        };
      }
      default:
        return { ok: false, error: "Unknown action" };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Action execution failed";
    return { ok: false, error: message };
  }
}
