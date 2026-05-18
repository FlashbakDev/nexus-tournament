import { ITournamentEntity } from "../entities/tournament.entity";
import { TournamentRepository } from "../repositories/tournament.repository";

export class GetTournamentByIdUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(id: string): Promise<ITournamentEntity | null> {
    return this.tournamentRepository.getTournamentById(id);
  }
}
