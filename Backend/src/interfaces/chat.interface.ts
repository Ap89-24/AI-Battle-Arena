import { Document, Types } from "mongoose";

export interface IModelResponse {
  model: string;
  response: string;

  score: number;
  reasoning: string;

  latency?: number;
  tokens?: number;
}

export interface ITurn {
  prompt: string;

  responses: IModelResponse[];

  winner: string;
}

export interface IChat extends Document {
  userId: Types.ObjectId;

  title: string;

  turns: ITurn[];

  createdAt: Date;
  updatedAt: Date;
}