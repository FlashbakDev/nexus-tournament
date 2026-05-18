import { IListResult } from "~~/server/types/listResult";
import {
  CreateTournamentParamsSchema,
  getAllQuerySchema,
  tournamentIdParamSchema,
  UpdateTournamentParamsSchema,
} from "../params";
import { ITournamentEntity } from "../../business/entities/tournament.entity";
import { GetTournamentsUseCase } from "../../business/useCases/getTournaments.useCase";
import { CreateTournamentUseCase } from "../../business/useCases/createTournament.useCase";
import { GetTournamentByIdUseCase } from "../../business/useCases/getTournamentById.useCase";
import { UpdateTournamentUseCase } from "../../business/useCases/updateTournament.useCase";
import { DeleteTournamentUseCase } from "../../business/useCases/deleteTournament.useCase";
import { requireAdmin } from "~~/server/utils/auth";
import {
  emitTournamentDeleted,
  emitTournamentUpdated,
} from "~~/server/features/realtime/presentation/socketEmitter";
import type { H3Event } from "h3";

export class TournamentProvider {
  constructor(
    private readonly getTournamentsUseCase: GetTournamentsUseCase,
    private readonly createTournamentUseCase: CreateTournamentUseCase,
    private readonly getTournamentByIdUseCase: GetTournamentByIdUseCase,
    private readonly updateTournamentUseCase: UpdateTournamentUseCase,
    private readonly deleteTournamentUseCase: DeleteTournamentUseCase,
  ) {}

  async getAll(event: H3Event): Promise<IListResult<ITournamentEntity>> {
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

    return this.getTournamentsUseCase.execute(validateQueryResult.data);
  }

  async create(event: H3Event): Promise<ITournamentEntity> {
    const user = await requireAdmin(event);

    const validateBodyResult = await readValidatedBody(event, (body) =>
      CreateTournamentParamsSchema.safeParse(body),
    );

    if (!validateBodyResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateBodyResult.error.message,
      });
    }

    return this.createTournamentUseCase.execute(validateBodyResult.data, user);
  }

  async getById(event: H3Event): Promise<ITournamentEntity> {
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

    const tournament = await this.getTournamentByIdUseCase.execute(
      validateParamsResult.data.id,
    );

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: "NOT_FOUND",
      });
    }

    return tournament;
  }

  async update(event: H3Event): Promise<ITournamentEntity> {
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
      UpdateTournamentParamsSchema.safeParse(body),
    );

    if (!validateBodyResult.success) {
      throw createError({
        statusCode: 400,
        statusMessage: "BAD_REQUEST",
        message: validateBodyResult.error.message,
      });
    }

    const tournament = await this.updateTournamentUseCase.execute(
      validateParamsResult.data.id,
      validateBodyResult.data,
    );

    if (!tournament) {
      throw createError({
        statusCode: 404,
        statusMessage: "NOT_FOUND",
      });
    }

    emitTournamentUpdated(tournament);
    return tournament;
  }

  async delete(event: H3Event): Promise<void> {
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

    const deleted = await this.deleteTournamentUseCase.execute(
      validateParamsResult.data.id,
    );

    if (!deleted) {
      throw createError({
        statusCode: 404,
        statusMessage: "NOT_FOUND",
      });
    }

    emitTournamentDeleted({ id: validateParamsResult.data.id });
    setResponseStatus(event, 204);
  }
}
