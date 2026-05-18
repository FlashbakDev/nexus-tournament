import { IListResult } from "~~/server/types/listResult";
import { IGetAllQueryParams } from "../../presentation/params";
import { ITournamentParticipantEntity } from "../entities/tournamentParticipant.entity";
import { TournamentParticipantRepository } from "../repositories/tournamentParticipant.repository";

export class GetTournamentParticipantsUseCase {
  constructor(
    private readonly repository: TournamentParticipantRepository,
  ) {}

  async execute(
    tournamentId: string,
    params: IGetAllQueryParams,
  ): Promise<IListResult<ITournamentParticipantEntity>> {
    return this.repository.getParticipants(tournamentId, params);
  }
}
