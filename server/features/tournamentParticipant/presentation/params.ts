import { z } from "zod";

export const CreateTournamentParticipantParamsSchema = z.object({
  name: z.string().min(1),
});

export type ICreateTournamentParticipantParams = z.infer<
  typeof CreateTournamentParticipantParamsSchema
>;

export const getAllQuerySchema = z.object({
  limit: z.coerce.number().min(1).optional().default(10),
  skip: z.coerce.number().min(0).optional().default(0),
  filter: z.string().optional(),
  sortBy: z.enum(["name", "createdAt"]).optional().default("createdAt"),
  orderBy: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type IGetAllQueryParams = z.infer<typeof getAllQuerySchema>;

export const UpdateTournamentParticipantParamsSchema = z
  .object({
    name: z.string().min(1).optional(),
    isReady: z.boolean().optional(),
  })
  .refine((data) => data.name !== undefined || data.isReady !== undefined, {
    message: "At least one field must be provided",
  });

export type IUpdateTournamentParticipantParams = z.infer<
  typeof UpdateTournamentParticipantParamsSchema
>;

export const tournamentIdParamSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
});

export type ITournamentIdParams = z.infer<typeof tournamentIdParamSchema>;

export const tournamentParticipantParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i),
  participantId: z.string().regex(/^[a-f\d]{24}$/i),
});

export type ITournamentParticipantParams = z.infer<
  typeof tournamentParticipantParamsSchema
>;
