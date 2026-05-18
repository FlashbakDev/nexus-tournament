import { IListResult } from "~~/server/types/listResult";
import {
  ICreateTournamentParticipantParams,
  IGetAllQueryParams,
  IUpdateTournamentParticipantParams,
} from "../../presentation/params";
import {
  ITournamentParticipantModel,
  TournamentParticipantModel,
} from "../models/tournamentParticipant.model";

const participantSelect = {
  _id: 1,
  name: 1,
  tournamentId: 1,
  createdAt: 1,
  updatedAt: 1,
} as const;

export class TournamentParticipantRemoteDataSource {
  async getParticipants(
    tournamentId: string,
    params: IGetAllQueryParams,
  ): Promise<IListResult<ITournamentParticipantModel>> {
    const sort = {
      [params.sortBy]: params.orderBy === "asc" ? 1 : -1,
    } as Record<string, 1 | -1>;

    const filter: Record<string, unknown> = {
      tournamentId,
    };

    if (params.filter) {
      filter.name = {
        $regex: params.filter,
        $options: "i",
      };
    }

    const findQuery = TournamentParticipantModel.find(filter)
      .sort(sort)
      .skip(params.skip)
      .limit(params.limit)
      .select(participantSelect);

    const countQuery = TournamentParticipantModel.countDocuments(filter);

    const [results, total_results] = await Promise.all([findQuery, countQuery]);

    const total_pages = Math.max(1, Math.ceil(total_results / params.limit));

    return {
      page: params.skip / params.limit + 1,
      results,
      total_pages,
      total_results,
    };
  }

  async createParticipant(
    tournamentId: string,
    params: ICreateTournamentParticipantParams,
  ): Promise<ITournamentParticipantModel> {
    return TournamentParticipantModel.create({
      name: params.name,
      tournamentId,
    });
  }

  async getParticipantById(
    tournamentId: string,
    id: string,
  ): Promise<ITournamentParticipantModel | null> {
    return TournamentParticipantModel.findOne({
      _id: id,
      tournamentId,
    }).select(participantSelect);
  }

  async updateParticipant(
    tournamentId: string,
    id: string,
    params: IUpdateTournamentParticipantParams,
  ): Promise<ITournamentParticipantModel | null> {
    return TournamentParticipantModel.findOneAndUpdate(
      { _id: id, tournamentId },
      { name: params.name },
      { new: true },
    ).select(participantSelect);
  }

  async deleteParticipant(
    tournamentId: string,
    id: string,
  ): Promise<ITournamentParticipantModel | null> {
    return TournamentParticipantModel.findOneAndDelete({
      _id: id,
      tournamentId,
    }).select(participantSelect);
  }
}
