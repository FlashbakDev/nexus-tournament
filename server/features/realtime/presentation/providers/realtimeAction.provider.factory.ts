import { GetTournamentByIdUseCase } from "~~/server/features/tournament/business/useCases/getTournamentById.useCase";
import { TournamentRemoteDataSource } from "~~/server/features/tournament/data/dataSources/tournament.remote.dataSource";
import { TournamentRepositoryImpl } from "~~/server/features/tournament/data/repositories/tournament.repositoryImpl";
import { CreateTournamentParticipantUseCase } from "~~/server/features/tournamentParticipant/business/useCases/createTournamentParticipant.useCase";
import { DeleteTournamentParticipantUseCase } from "~~/server/features/tournamentParticipant/business/useCases/deleteTournamentParticipant.useCase";
import { UpdateTournamentParticipantUseCase } from "~~/server/features/tournamentParticipant/business/useCases/updateTournamentParticipant.useCase";
import { TournamentParticipantRemoteDataSource } from "~~/server/features/tournamentParticipant/data/dataSources/tournamentParticipant.remote.dataSource";
import { TournamentParticipantRepositoryImpl } from "~~/server/features/tournamentParticipant/data/repositories/tournamentParticipant.repositoryImpl";
import { RealtimeActionProvider } from "./realtimeAction.provider";

let realtimeActionProviderInstance: RealtimeActionProvider | null = null;

export async function getRealtimeActionProviderInstance(): Promise<RealtimeActionProvider> {
  if (!realtimeActionProviderInstance) {
    const tournamentRepository = new TournamentRepositoryImpl(
      new TournamentRemoteDataSource(),
    );
    const participantRepository = new TournamentParticipantRepositoryImpl(
      new TournamentParticipantRemoteDataSource(),
    );

    realtimeActionProviderInstance = new RealtimeActionProvider(
      new CreateTournamentParticipantUseCase(participantRepository),
      new UpdateTournamentParticipantUseCase(participantRepository),
      new DeleteTournamentParticipantUseCase(participantRepository),
      new GetTournamentByIdUseCase(tournamentRepository),
    );
  }
  return realtimeActionProviderInstance;
}
