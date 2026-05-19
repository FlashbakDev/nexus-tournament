import { z } from "zod";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";
import type { IUpdateTournamentParticipantParams } from "~~/server/features/tournamentParticipant/presentation/params";

export const tournamentParticipantEntitySchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
  name: z.string().min(1),
  tournamentId: z.string().regex(/^[a-f\d]{24}$/i),
  isReady: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type TournamentParticipantEntityPayload = z.infer<
  typeof tournamentParticipantEntitySchema
>;

export type ParticipantActionPayload = {
  participant: TournamentParticipantEntityPayload;
};

/** Mappe l'entité vers les champs modifiables (extensible). */
export function participantEntityToUpdateParams(
  participant: Pick<ITournamentParticipantEntity, "name">,
): IUpdateTournamentParticipantParams {
  return {
    name: participant.name,
  };
}

export function participantIsReadyToUpdateParams(
  isReady: boolean,
): IUpdateTournamentParticipantParams {
  return { isReady };
}
