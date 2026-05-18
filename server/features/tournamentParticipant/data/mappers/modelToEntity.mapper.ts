import { ITournamentParticipantEntity } from "../../business/entities/tournamentParticipant.entity";
import { ITournamentParticipantModel } from "../models/tournamentParticipant.model";

export function modelToEntity(
  model: ITournamentParticipantModel,
): ITournamentParticipantEntity {
  return {
    id: model._id.toString(),
    name: model.name,
    tournamentId: model.tournamentId.toString(),
    createdAt: model.createdAt.toISOString(),
    updatedAt: model.updatedAt.toISOString(),
  };
}
