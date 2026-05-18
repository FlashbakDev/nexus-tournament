import {
  ICreateTournamentParams,
  IGetAllQueryParams,
  IUpdateTournamentParams,
} from "../../presentation/params";
import { TournamentRemoteDataSource } from "../dataSources/tournament.remote.dataSource";
import { IUserEntity } from "~~/server/features/user/business/entities/user.entity";
import { ITournamentEntity } from "../../business/entities/tournament.entity";
import { IListResult } from "~~/server/types/listResult";
import { TournamentRepository } from "../../business/repositories/tournament.repository";
import { modelToEntity } from "../mappers/modelToEntity.mapper";

export class TournamentRepositoryImpl extends TournamentRepository {
  constructor(
    private readonly tournamentRemoteDataSource: TournamentRemoteDataSource,
  ) {
    super();
  }
  async getTournaments(
    params: IGetAllQueryParams,
    user?: IUserEntity,
  ): Promise<IListResult<ITournamentEntity>> {
    const result = await this.tournamentRemoteDataSource.getTournaments(
      params,
      user,
    );
    return {
      page: result.page,
      results: result.results.map((p) => modelToEntity(p, user)),
      total_pages: result.total_pages,
      total_results: result.total_results,
    };
  }

  async createTournament(
    params: ICreateTournamentParams,
    user: IUserEntity,
  ): Promise<ITournamentEntity> {
    const model = await this.tournamentRemoteDataSource.createTournament(
      params,
      user,
    );
    return modelToEntity(model, user);
  }

  async getTournamentById(id: string): Promise<ITournamentEntity | null> {
    const model = await this.tournamentRemoteDataSource.getTournamentById(id);
    if (!model) {
      return null;
    }
    return modelToEntity(model);
  }

  async updateTournament(
    id: string,
    params: IUpdateTournamentParams,
  ): Promise<ITournamentEntity | null> {
    const model = await this.tournamentRemoteDataSource.updateTournament(
      id,
      params,
    );
    if (!model) {
      return null;
    }
    return modelToEntity(model);
  }

  async deleteTournament(id: string): Promise<boolean> {
    const model = await this.tournamentRemoteDataSource.deleteTournament(id);
    return model !== null;
  }
}
