import { ICreateTournamentParticipantParams } from "../../presentation/params";
import { ITournamentParticipantEntity } from "../entities/tournamentParticipant.entity";
import { TournamentParticipantRepository } from "../repositories/tournamentParticipant.repository";

export class CreateTournamentParticipantUseCase {
  constructor(
    private readonly repository: TournamentParticipantRepository,
  ) {}

  async execute(
    tournamentId: string,
    params: ICreateTournamentParticipantParams,
  ): Promise<ITournamentParticipantEntity> {
    return this.repository.createParticipant(tournamentId, params);
  }
}
