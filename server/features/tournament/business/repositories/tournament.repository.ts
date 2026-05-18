import { IListResult } from "~~/server/types/listResult";
import {
  ICreateTournamentParams,
  IGetAllQueryParams,
  IUpdateTournamentParams,
} from "../../presentation/params";
import { ITournamentEntity } from "../entities/tournament.entity";
import { IUserEntity } from "~~/server/features/user/business/entities/user.entity";

export abstract class TournamentRepository {
  abstract getTournaments(
    params: IGetAllQueryParams,
    user?: IUserEntity,
  ): Promise<IListResult<ITournamentEntity>>;

  abstract createTournament(
    params: ICreateTournamentParams,
    user: IUserEntity,
  ): Promise<ITournamentEntity>;

  abstract getTournamentById(id: string): Promise<ITournamentEntity | null>;

  abstract updateTournament(
    id: string,
    params: IUpdateTournamentParams,
  ): Promise<ITournamentEntity | null>;

  abstract deleteTournament(id: string): Promise<boolean>;
}
