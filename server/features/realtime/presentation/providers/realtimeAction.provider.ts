import type { ITournamentEntity } from "~~/server/features/tournament/business/entities/tournament.entity";
import { GetTournamentByIdUseCase } from "~~/server/features/tournament/business/useCases/getTournamentById.useCase";
import type { ITournamentParticipantEntity } from "~~/server/features/tournamentParticipant/business/entities/tournamentParticipant.entity";
import { CreateTournamentParticipantUseCase } from "~~/server/features/tournamentParticipant/business/useCases/createTournamentParticipant.useCase";
import { DeleteTournamentParticipantUseCase } from "~~/server/features/tournamentParticipant/business/useCases/deleteTournamentParticipant.useCase";
import { UpdateTournamentParticipantUseCase } from "~~/server/features/tournamentParticipant/business/useCases/updateTournamentParticipant.useCase";
import type {
  AddParticipantActionPayload,
  DeleteParticipantActionPayload,
  SetParticipantIsReadyActionPayload,
  UpdateParticipantActionPayload,
} from "~~/shared/realtime/actions";
import {
  participantEntityToUpdateParams,
  participantIsReadyToUpdateParams,
} from "~~/shared/realtime/participantPayload";
import {
  emitParticipantCreated,
  emitParticipantDeleted,
  emitParticipantUpdated,
  emitTournamentUpdated,
} from "../socketEmitter";

export class RealtimeActionProvider {
  constructor(
    private readonly createParticipantUseCase: CreateTournamentParticipantUseCase,
    private readonly updateParticipantUseCase: UpdateTournamentParticipantUseCase,
    private readonly deleteParticipantUseCase: DeleteTournamentParticipantUseCase,
    private readonly getTournamentByIdUseCase: GetTournamentByIdUseCase,
  ) {}

  private async emitTournamentUpdate(
    tournamentId: string,
  ): Promise<ITournamentEntity> {
    const tournament = await this.getTournamentByIdUseCase.execute(tournamentId);
    if (!tournament) {
      throw new Error("Tournament not found");
    }
    emitTournamentUpdated(tournament);
    return tournament;
  }

  async addParticipant(payload: AddParticipantActionPayload): Promise<{
    participant: ITournamentParticipantEntity;
    tournament: ITournamentEntity;
  }> {
    const participant = await this.createParticipantUseCase.execute(
      payload.tournamentId,
      { name: payload.name },
    );

    emitParticipantCreated(participant);
    const tournament = await this.emitTournamentUpdate(payload.tournamentId);

    return { participant, tournament };
  }

  async updateParticipant(payload: UpdateParticipantActionPayload): Promise<{
    participant: ITournamentParticipantEntity;
    tournament: ITournamentEntity;
  }> {
    const { participant: input } = payload;
    const updateParams = participantEntityToUpdateParams(input);

    const participant = await this.updateParticipantUseCase.execute(
      input.tournamentId,
      input.id,
      updateParams,
    );

    if (!participant) {
      throw new Error("Participant not found");
    }

    emitParticipantUpdated(participant);
    const tournament = await this.emitTournamentUpdate(input.tournamentId);

    return { participant, tournament };
  }

  async setParticipantIsReady(
    payload: SetParticipantIsReadyActionPayload,
  ): Promise<{
    participant: ITournamentParticipantEntity;
    tournament: ITournamentEntity;
  }> {
    const { participant: input, isReady } = payload;
    const updateParams = participantIsReadyToUpdateParams(isReady);

    const participant = await this.updateParticipantUseCase.execute(
      input.tournamentId,
      input.id,
      updateParams,
    );

    if (!participant) {
      throw new Error("Participant not found");
    }

    emitParticipantUpdated(participant);
    const tournament = await this.emitTournamentUpdate(input.tournamentId);

    return { participant, tournament };
  }

  async deleteParticipant(payload: DeleteParticipantActionPayload): Promise<{
    participantId: string;
    tournamentId: string;
    tournament: ITournamentEntity;
  }> {
    const { participant: input } = payload;

    const deleted = await this.deleteParticipantUseCase.execute(
      input.tournamentId,
      input.id,
    );

    if (!deleted) {
      throw new Error("Participant not found");
    }

    emitParticipantDeleted({
      id: input.id,
      tournamentId: input.tournamentId,
    });
    const tournament = await this.emitTournamentUpdate(input.tournamentId);

    return {
      participantId: input.id,
      tournamentId: input.tournamentId,
      tournament,
    };
  }
}
