import { Types, Schema, model, Document } from "mongoose";

export interface ITournamentParticipantModel extends Document {
  name: string;
  tournamentId: Types.ObjectId;
  isReady: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tournamentParticipantSchema = new Schema<ITournamentParticipantModel>(
  {
    name: { type: String, required: true },
    isReady: { type: Boolean, required: true, default: false },
    tournamentId: {
      type: Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
  },
  {
    _id: true,
    timestamps: true,
  },
);

tournamentParticipantSchema.index({ tournamentId: 1 });
tournamentParticipantSchema.index({ tournamentId: 1, name: 1 });
tournamentParticipantSchema.index({ tournamentId: 1, createdAt: -1 });

export const TournamentParticipantModel = model<ITournamentParticipantModel>(
  "TournamentParticipant",
  tournamentParticipantSchema,
  "tournament_participants",
);
