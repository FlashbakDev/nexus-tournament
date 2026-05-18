import { z } from "zod";

export const CreateTournamentParamsSchema = z.object({
  name: z.string().min(1),
});

export type ICreateTournamentParams = z.infer<
  typeof CreateTournamentParamsSchema
>;

export const getAllQuerySchema = z.object({
  limit: z.coerce.number().min(1).optional().default(10),
  skip: z.coerce.number().min(0).optional().default(0),
  filter: z.string().optional(),
  sortBy: z.enum(["name", "createdAt"]).optional().default("createdAt"),
  orderBy: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type IGetAllQueryParams = z.infer<typeof getAllQuerySchema>;

export const UpdateTournamentParamsSchema = z.object({
  name: z.string().min(1),
});

export type IUpdateTournamentParams = z.infer<
  typeof UpdateTournamentParamsSchema
>;

export const tournamentIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
});

export type ITournamentIdParams = z.infer<typeof tournamentIdParamSchema>;
