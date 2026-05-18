import { IUserEntity } from "~~/server/features/user/business/entities/user.entity";
import { ITournamentEntity } from "../entities/tournament.entity";
import { IGetAllQueryParams } from "../../presentation/params";
import { IListResult } from "~~/server/types/listResult";
import { TournamentRepository } from "../repositories/tournament.repository";

export class GetTournamentsUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}
  async execute(
    params: IGetAllQueryParams,
    user?: IUserEntity,
  ): Promise<IListResult<ITournamentEntity>> {
    return this.tournamentRepository.getTournaments(params, user);
  }
}
