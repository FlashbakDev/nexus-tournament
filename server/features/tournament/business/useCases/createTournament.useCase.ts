import { IUserEntity } from "~~/server/features/user/business/entities/user.entity";
import { ITournamentEntity } from "../entities/tournament.entity";
import { ICreateTournamentParams } from "../../presentation/params";
import { TournamentRepository } from "../repositories/tournament.repository";

export class CreateTournamentUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(
    params: ICreateTournamentParams,
    user: IUserEntity,
  ): Promise<ITournamentEntity> {
    return this.tournamentRepository.createTournament(params, user);
  }
}
