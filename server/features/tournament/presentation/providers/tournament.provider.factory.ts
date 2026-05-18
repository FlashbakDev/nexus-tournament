import { GetTournamentsUseCase } from "../../business/useCases/getTournaments.useCase";
import { CreateTournamentUseCase } from "../../business/useCases/createTournament.useCase";
import { GetTournamentByIdUseCase } from "../../business/useCases/getTournamentById.useCase";
import { UpdateTournamentUseCase } from "../../business/useCases/updateTournament.useCase";
import { DeleteTournamentUseCase } from "../../business/useCases/deleteTournament.useCase";
import { TournamentRemoteDataSource } from "../../data/dataSources/tournament.remote.dataSource";
import { TournamentRepositoryImpl } from "../../data/repositories/tournament.repositoryImpl";
import { TournamentProvider } from "./tournament.provider";

let tournamentProviderInstance: TournamentProvider | null = null;

/**
 * Crée ou retourne l'instance existante du TournamentProvider
 * @returns Instance du TournamentProvider avec ses dépendances injectées
 */
export async function getTournamentProviderInstance(): Promise<TournamentProvider> {
  if (!tournamentProviderInstance) {
    const remoteDataSource = new TournamentRemoteDataSource();
    const tournamentRepository = new TournamentRepositoryImpl(remoteDataSource);
    const getTournamentsUseCase = new GetTournamentsUseCase(tournamentRepository);
    const createTournamentUseCase = new CreateTournamentUseCase(
      tournamentRepository,
    );
    const getTournamentByIdUseCase = new GetTournamentByIdUseCase(
      tournamentRepository,
    );
    const updateTournamentUseCase = new UpdateTournamentUseCase(
      tournamentRepository,
    );
    const deleteTournamentUseCase = new DeleteTournamentUseCase(
      tournamentRepository,
    );
    tournamentProviderInstance = new TournamentProvider(
      getTournamentsUseCase,
      createTournamentUseCase,
      getTournamentByIdUseCase,
      updateTournamentUseCase,
      deleteTournamentUseCase,
    );
  }
  return tournamentProviderInstance;
}

/**
 * Réinitialise l'instance (utile pour les tests)
 */
export function resetTournamentProviderInstance(): void {
  tournamentProviderInstance = null;
}
