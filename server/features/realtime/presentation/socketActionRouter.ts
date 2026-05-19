import { z } from "zod";
import { tournamentIdParamSchema } from "~~/server/features/tournament/presentation/params";
import { CreateTournamentParticipantParamsSchema } from "~~/server/features/tournamentParticipant/presentation/params";
import {
  SOCKET_ACTIONS,
  type SocketActionRequest,
  type SocketActionResponse,
} from "~~/shared/realtime/actions";
import { getRealtimeActionProviderInstance } from "./providers/realtimeAction.provider.factory";

const addParticipantPayloadSchema = z.object({
  tournamentId: tournamentIdParamSchema.shape.id,
  name: CreateTournamentParticipantParamsSchema.shape.name,
});

const actionRequestSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal(SOCKET_ACTIONS.ADD_PARTICIPANT),
    payload: addParticipantPayloadSchema,
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
      default:
        return { ok: false, error: "Unknown action" };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Action execution failed";
    return { ok: false, error: message };
  }
}
