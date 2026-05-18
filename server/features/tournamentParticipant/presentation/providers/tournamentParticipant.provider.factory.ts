import { CreateTournamentParticipantUseCase } from "../../business/useCases/createTournamentParticipant.useCase";
import { DeleteTournamentParticipantUseCase } from "../../business/useCases/deleteTournamentParticipant.useCase";
import { GetTournamentParticipantByIdUseCase } from "../../business/useCases/getTournamentParticipantById.useCase";
import { GetTournamentParticipantsUseCase } from "../../business/useCases/getTournamentParticipants.useCase";
import { UpdateTournamentParticipantUseCase } from "../../business/useCases/updateTournamentParticipant.useCase";
import { TournamentParticipantRemoteDataSource } from "../../data/dataSources/tournamentParticipant.remote.dataSource";
import { TournamentParticipantRepositoryImpl } from "../../data/repositories/tournamentParticipant.repositoryImpl";
import { TournamentParticipantProvider } from "./tournamentParticipant.provider";

let tournamentParticipantProviderInstance: TournamentParticipantProvider | null =
  null;

export async function getTournamentParticipantProviderInstance(): Promise<TournamentParticipantProvider> {
  if (!tournamentParticipantProviderInstance) {
    const remoteDataSource = new TournamentParticipantRemoteDataSource();
    const repository = new TournamentParticipantRepositoryImpl(remoteDataSource);
    const getParticipantsUseCase = new GetTournamentParticipantsUseCase(
      repository,
    );
    const createParticipantUseCase = new CreateTournamentParticipantUseCase(
      repository,
    );
    const getParticipantByIdUseCase = new GetTournamentParticipantByIdUseCase(
      repository,
    );
    const updateParticipantUseCase = new UpdateTournamentParticipantUseCase(
      repository,
    );
    const deleteParticipantUseCase = new DeleteTournamentParticipantUseCase(
      repository,
    );
    tournamentParticipantProviderInstance = new TournamentParticipantProvider(
      getParticipantsUseCase,
      createParticipantUseCase,
      getParticipantByIdUseCase,
      updateParticipantUseCase,
      deleteParticipantUseCase,
    );
  }
  return tournamentParticipantProviderInstance;
}

export function resetTournamentParticipantProviderInstance(): void {
  tournamentParticipantProviderInstance = null;
}
