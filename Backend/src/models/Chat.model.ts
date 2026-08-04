import mongoose, { Schema } from "mongoose";
import { IChat } from "../interfaces/chat.interface.js";

const ResponseSchema = new Schema(
  {
    model: {
      type: String,
      required: true,
    },

    response: {
      type: String,
      required: true,
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 10,
    },

    reasoning: {
      type: String,
      required: true,
    },

    latency: Number,

    tokens: Number,
  },
  {
    _id: false,
  }
);

const TurnSchema = new Schema(
  {
    prompt: {
      type: String,
      required: true,
    },

    responses: {
      type: [ResponseSchema],
      required: true,
    },

    winner: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    _id: false,
  }
);

const ChatSchema = new Schema<IChat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "New Battle",
      trim: true,
    },

    turns: {
      type: [TurnSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IChat>("Chat", ChatSchema);