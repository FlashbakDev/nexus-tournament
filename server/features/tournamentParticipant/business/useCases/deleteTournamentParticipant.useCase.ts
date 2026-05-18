import { TournamentParticipantRepository } from "../repositories/tournamentParticipant.repository";

export class DeleteTournamentParticipantUseCase {
  constructor(
    private readonly repository: TournamentParticipantRepository,
  ) {}

  async execute(tournamentId: string, id: string): Promise<boolean> {
    return this.repository.deleteParticipant(tournamentId, id);
  }
}
