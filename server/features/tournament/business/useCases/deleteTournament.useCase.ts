import { TournamentRepository } from "../repositories/tournament.repository";

export class DeleteTournamentUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.tournamentRepository.deleteTournament(id);
  }
}
