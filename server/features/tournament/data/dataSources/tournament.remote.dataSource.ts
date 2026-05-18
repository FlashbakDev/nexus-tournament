import { IListResult } from "~~/server/types/listResult";
import { IUserEntity } from "~~/server/features/user/business/entities/user.entity";
import {
  ICreateTournamentParams,
  IGetAllQueryParams,
  IUpdateTournamentParams,
} from "../../presentation/params";
import { ITournamentModel, TournamentModel } from "../models/tournament.model";

const tournamentSelect = {
  _id: 1,
  name: 1,
  createdAt: 1,
  updatedAt: 1,
  createdByUserId: 1,
} as const;

export class TournamentRemoteDataSource {
  constructor() {}
  async getTournaments(
    params: IGetAllQueryParams,
    user?: IUserEntity,
  ): Promise<IListResult<ITournamentModel>> {
    const sort = {
      [params.sortBy]: params.orderBy === "asc" ? 1 : -1,
    } as Record<string, 1 | -1>;
    const skip = params.skip;
    const limit = params.limit;
    const filter = params.filter
      ? {
          name: {
            $regex: params.filter,
            $options: "i",
          },
        }
      : {};

    const findQuery = TournamentModel.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(tournamentSelect);

    const countQuery = TournamentModel.countDocuments(filter);

    const [results, total_results] = await Promise.all([findQuery, countQuery]);

    const total_pages = Math.max(1, Math.ceil(total_results / limit));

    return {
      page: skip / limit + 1,
      results,
      total_pages,
      total_results,
    };
  }

  async createTournament(
    params: ICreateTournamentParams,
    user: IUserEntity,
  ): Promise<ITournamentModel> {
    return TournamentModel.create({
      name: params.name,
      createdByUserId: user.id,
    });
  }

  async getTournamentById(id: string): Promise<ITournamentModel | null> {
    return TournamentModel.findById(id).select(tournamentSelect);
  }

  async updateTournament(
    id: string,
    params: IUpdateTournamentParams,
  ): Promise<ITournamentModel | null> {
    return TournamentModel.findByIdAndUpdate(
      id,
      { name: params.name },
      { new: true },
    ).select(tournamentSelect);
  }

  async deleteTournament(id: string): Promise<ITournamentModel | null> {
    return TournamentModel.findByIdAndDelete(id).select(tournamentSelect);
  }
}
