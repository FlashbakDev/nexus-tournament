import { getTournamentParticipantProviderInstance } from "~~/server/features/tournamentParticipant/presentation/providers/tournamentParticipant.provider.factory";

export default defineEventHandler(async (event) => {
  const provider = await getTournamentParticipantProviderInstance();
  return provider.update(event);
});
