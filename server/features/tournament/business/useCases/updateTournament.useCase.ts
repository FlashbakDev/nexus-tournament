import { ITournamentEntity } from "../entities/tournament.entity";
import { IUpdateTournamentParams } from "../../presentation/params";
import { TournamentRepository } from "../repositories/tournament.repository";

export class UpdateTournamentUseCase {
  constructor(private readonly tournamentRepository: TournamentRepository) {}

  async execute(
    id: string,
    params: IUpdateTournamentParams,
  ): Promise<ITournamentEntity | null> {
    return this.tournamentRepository.updateTournament(id, params);
  }
}
