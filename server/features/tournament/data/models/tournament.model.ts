import defineSchema from "nuxt-mongoose";
import { Types, Schema, model, Document } from "mongoose";

export interface ITournamentModel extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
  createdByUserId: Types.ObjectId;
}

const tournamentSchema = new Schema<ITournamentModel>(
  {
    name: { type: String, required: true },
    createdByUserId: { type: Types.ObjectId, ref: "User", required: true },
  },
  {
    _id: true,
    timestamps: true,
  },
);

tournamentSchema.index({ name: 1 });
tournamentSchema.index({ name: -1 });
tournamentSchema.index({ createdAt: 1 });
tournamentSchema.index({ createdAt: -1 });

export const TournamentModel = model<ITournamentModel>(
  "Tournament",
  tournamentSchema,
  "tournaments",
);
