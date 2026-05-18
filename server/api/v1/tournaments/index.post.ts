import { getTournamentProviderInstance } from "~~/server/features/tournament/presentation/providers/tournament.provider.factory";

export default defineEventHandler(async (event) => {
  const tournamentProvider = await getTournamentProviderInstance();
  return tournamentProvider.create(event);
});
