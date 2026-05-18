import { IListResult } from "~~/server/types/listResult";
import {
  ICreateTournamentParticipantParams,
  IGetAllQueryParams,
  IUpdateTournamentParticipantParams,
} from "../../presentation/params";
import { ITournamentParticipantEntity } from "../entities/tournamentParticipant.entity";

export abstract class TournamentParticipantRepository {
  abstract getParticipants(
    tournamentId: string,
    params: IGetAllQueryParams,
  ): Promise<IListResult<ITournamentParticipantEntity>>;

  abstract createParticipant(
    tournamentId: string,
    params: ICreateTournamentParticipantParams,
  ): Promise<ITournamentParticipantEntity>;

  abstract getParticipantById(
    tournamentId: string,
    id: string,
  ): Promise<ITournamentParticipantEntity | null>;

  abstract updateParticipant(
    tournamentId: string,
    id: string,
    params: IUpdateTournamentParticipantParams,
  ): Promise<ITournamentParticipantEntity | null>;

  abstract deleteParticipant(
    tournamentId: string,
    id: string,
  ): Promise<boolean>;
}
