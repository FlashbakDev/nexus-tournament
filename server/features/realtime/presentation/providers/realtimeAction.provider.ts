import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import { GetTournamentByIdUseCase } from "~~/server/features/tournament/business/useCases/getTournamentById.useCase";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";
import { CreateTournamentParticipantUseCase } from "~~/server/features/tournamentParticipant/business/useCases/createTournamentParticipant.useCase";
import {
  emitParticipantCreated,
  emitTournamentUpdated,
} from "../socketEmitter";
import type { AddParticipantActionPayload } from "~~/shared/realtime/actions";

export class RealtimeActionProvider {
  constructor(
    private readonly createParticipantUseCase: CreateTournamentParticipantUseCase,
    private readonly getTournamentByIdUseCase: GetTournamentByIdUseCase,
  ) {}

  async addParticipant(
    payload: AddParticipantActionPayload,
  ): Promise<{
    participant: ITournamentParticipantEntity;
    tournament: ITournamentEntity;
  }> {
    const participant = await this.createParticipantUseCase.execute(
      payload.tournamentId,
      { name: payload.name },
    );

    emitParticipantCreated(participant);

    const tournament = await this.getTournamentByIdUseCase.execute(
      payload.tournamentId,
    );

    if (!tournament) {
      throw new Error("Tournament not found");
    }

    emitTournamentUpdated(tournament);

    return { participant, tournament };
  }
}
