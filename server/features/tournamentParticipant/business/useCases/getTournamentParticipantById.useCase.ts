import { ITournamentParticipantEntity } from "../entities/tournamentParticipant.entity";
import { TournamentParticipantRepository } from "../repositories/tournamentParticipant.repository";

export class GetTournamentParticipantByIdUseCase {
  constructor(
    private readonly repository: TournamentParticipantRepository,
  ) {}

  async execute(
    tournamentId: string,
    id: string,
  ): Promise<ITournamentParticipantEntity | null> {
    return this.repository.getParticipantById(tournamentId, id);
  }
}
