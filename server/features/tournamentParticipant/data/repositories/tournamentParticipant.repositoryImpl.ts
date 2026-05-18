import { IListResult } from "~~/server/types/listResult";
import { ITournamentParticipantEntity } from "../../business/entities/tournamentParticipant.entity";
import { TournamentParticipantRepository } from "../../business/repositories/tournamentParticipant.repository";
import {
  ICreateTournamentParticipantParams,
  IGetAllQueryParams,
  IUpdateTournamentParticipantParams,
} from "../../presentation/params";
import { TournamentParticipantRemoteDataSource } from "../dataSources/tournamentParticipant.remote.dataSource";
import { modelToEntity } from "../mappers/modelToEntity.mapper";

export class TournamentParticipantRepositoryImpl extends TournamentParticipantRepository {
  constructor(
    private readonly remoteDataSource: TournamentParticipantRemoteDataSource,
  ) {
    super();
  }

  async getParticipants(
    tournamentId: string,
    params: IGetAllQueryParams,
  ): Promise<IListResult<ITournamentParticipantEntity>> {
    const result = await this.remoteDataSource.getParticipants(
      tournamentId,
      params,
    );
    return {
      page: result.page,
      results: result.results.map(modelToEntity),
      total_pages: result.total_pages,
      total_results: result.total_results,
    };
  }

  async createParticipant(
    tournamentId: string,
    params: ICreateTournamentParticipantParams,
  ): Promise<ITournamentParticipantEntity> {
    const model = await this.remoteDataSource.createParticipant(
      tournamentId,
      params,
    );
    return modelToEntity(model);
  }

  async getParticipantById(
    tournamentId: string,
    id: string,
  ): Promise<ITournamentParticipantEntity | null> {
    const model = await this.remoteDataSource.getParticipantById(
      tournamentId,
      id,
    );
    if (!model) {
      return null;
    }
    return modelToEntity(model);
  }

  async updateParticipant(
    tournamentId: string,
    id: string,
    params: IUpdateTournamentParticipantParams,
  ): Promise<ITournamentParticipantEntity | null> {
    const model = await this.remoteDataSource.updateParticipant(
      tournamentId,
      id,
      params,
    );
    if (!model) {
      return null;
    }
    return modelToEntity(model);
  }

  async deleteParticipant(tournamentId: string, id: string): Promise<boolean> {
    const model = await this.remoteDataSource.deleteParticipant(
      tournamentId,
      id,
    );
    return model !== null;
  }
}
