import type { H3Event } from "h3";
import { IListResult } from "~~/server/types/listResult";
import { requireAdmin } from "~~/server/utils/auth";
import {
  emitParticipantCreated,
  emitParticipantDeleted,
  emitParticipantUpdated,
} from "~~/server/features/realtime/presentation/socketEmitter";
import { ITournamentParticipantEntity } from "../../business/entities/tournamentParticipant.entity";
import { CreateTournamentParticipantUseCase } from "../../business/useCases/createTournamentParticipant.useCase";
import { DeleteTournamentParticipantUseCase } from "../../business/useCases/deleteTournamentParticipant.useCase";
import { GetTournamentParticipantByIdUseCase } from "../../business/useCases/getTournamentParticipantById.useCase";
import { GetTournamentParticipantsUseCase } from "../../business/useCases/getTournamentParticipants.useCase";
import { UpdateTournamentParticipantUseCase } from "../../business/useCases/updateTournamentParticipant.useCase";
import {
  CreateTournamentParticipantParamsSchema,
  getAllQuerySchema,
  tournamentIdParamSchema,
  tournamentParticipantParamsSchema,
  UpdateTournamentParticipantParamsSchema,
} from "../params";

export class TournamentParticipantProvider {
  constructor(
    private readonly getParticipantsUseCase: GetTournamentParticipantsUseCase,
    private readonly createParticipantUseCase: CreateTournamentParticipantUseCase,
    private readonly getParticipantByIdUseCase: GetTournamentParticipantByIdUseCase,
    private readonly updateParticipantUseCase: UpdateTournamentParticipantUseCase,
    private readonly deleteParticipantUseCase: DeleteTournamentParticipantUseCase,
  ) {}

  async getAll(
    event: H3Event,
  ): Promise<IListResult<ITournamentParticipantEntity>> {
    const validateParamsResult = await getValidatedRouterParams(
      event,
      (params) => tournamentIdParamSchema.safeParse(params),
    );

    if (!validateParamsResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateParamsResult.error.message,
      });
    }

    const validateQueryResult = await getValidatedQuery(event, (query) =>
      getAllQuerySchema.safeParse(query),
    );

    if (!validateQueryResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateQueryResult.error.message,
      });
    }

    return this.getParticipantsUseCase.execute(
      validateParamsResult.data.id,
      validateQueryResult.data,
    );
  }

  async create(event: H3Event): Promise<ITournamentParticipantEntity> {
    await requireAdmin(event);

    const validateParamsResult = await getValidatedRouterParams(
      event,
      (params) => tournamentIdParamSchema.safeParse(params),
    );

    if (!validateParamsResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateParamsResult.error.message,
      });
    }

    const validateBodyResult = await readValidatedBody(event, (body) =>
      CreateTournamentParticipantParamsSchema.safeParse(body),
    );

    if (!validateBodyResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateBodyResult.error.message,
      });
    }

    const participant = await this.createParticipantUseCase.execute(
      validateParamsResult.data.id,
      validateBodyResult.data,
    );
    emitParticipantCreated(participant);
    return participant;
  }

  async getById(event: H3Event): Promise<ITournamentParticipantEntity> {
    const validateParamsResult = await getValidatedRouterParams(
      event,
      (params) => tournamentParticipantParamsSchema.safeParse(params),
    );

    if (!validateParamsResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateParamsResult.error.message,
      });
    }

    const participant = await this.getParticipantByIdUseCase.execute(
      validateParamsResult.data.id,
      validateParamsResult.data.participantId,
    );

    if (!participant) {
      throw createError({
        statusCode: 404,
        statusMessage: "NOT_FOUND",
      });
    }

    return participant;
  }

  async update(event: H3Event): Promise<ITournamentParticipantEntity> {
    await requireAdmin(event);

    const validateParamsResult = await getValidatedRouterParams(
      event,
      (params) => tournamentParticipantParamsSchema.safeParse(params),
    );

    if (!validateParamsResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateParamsResult.error.message,
      });
    }

    const validateBodyResult = await readValidatedBody(event, (body) =>
      UpdateTournamentParticipantParamsSchema.safeParse(body),
    );

    if (!validateBodyResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateBodyResult.error.message,
      });
    }

    const participant = await this.updateParticipantUseCase.execute(
      validateParamsResult.data.id,
      validateParamsResult.data.participantId,
      validateBodyResult.data,
    );

    if (!participant) {
      throw createError({
        statusCode: 404,
        statusMessage: "NOT_FOUND",
      });
    }

    emitParticipantUpdated(participant);
    return participant;
  }

  async delete(event: H3Event): Promise<void> {
    await requireAdmin(event);

    const validateParamsResult = await getValidatedRouterParams(
      event,
      (params) => tournamentParticipantParamsSchema.safeParse(params),
    );

    if (!validateParamsResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateParamsResult.error.message,
      });
    }

    const deleted = await this.deleteParticipantUseCase.execute(
      validateParamsResult.data.id,
      validateParamsResult.data.participantId,
    );

    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: "NOT_FOUND",
      });
    }

    emitParticipantDeleted({
      id: validateParamsResult.data.participantId,
      tournamentId: validateParamsResult.data.id,
    });
    setResponseStatus(event, 204);
  }
}
