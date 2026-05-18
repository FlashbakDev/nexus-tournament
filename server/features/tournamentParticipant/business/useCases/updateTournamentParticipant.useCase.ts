import { IUpdateTournamentParticipantParams } from "../../presentation/params";
import { ITournamentParticipantEntity } from "../entities/tournamentParticipant.entity";
import { TournamentParticipantRepository } from "../repositories/tournamentParticipant.repository";

export class UpdateTournamentParticipantUseCase {
  constructor(
    private readonly repository: TournamentParticipantRepository,
  ) {}

  async execute(
    tournamentId: string,
    id: string,
    params: IUpdateTournamentParticipantParams,
  ): Promise<ITournamentParticipantEntity | null> {
    return this.repository.updateParticipant(tournamentId, id, params);
  }
}
