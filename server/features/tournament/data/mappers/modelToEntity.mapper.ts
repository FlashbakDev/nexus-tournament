import { IUserEntity } from "~~/server/features/user/business/entities/user.entity";
import { ITournamentModel } from "../models/tournament.model";
import { ITournamentEntity } from "../../business/entities/tournament.entity";

export function modelToEntity(
  model: ITournamentModel,
  user?: IUserEntity,
): ITournamentEntity {
  const id = model._id.toString();
  return {
    id,
    name: model.name,
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
    createdByUserId: model.createdByUserId.toString(),
    url: `/tournaments/${id}`,
  };
}
