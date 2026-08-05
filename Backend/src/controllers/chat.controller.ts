import type { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import Chat from "../models/Chat.model.js";
import runGraph from "../Ai/graph.ai.services.js";

export const createChat = async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await runGraph(prompt);

    const winner =
      result.judge.solution_1_score > result.judge.solution_2_score
        ? "Mistral"
        : "Cohere";

    const chat = await Chat.create({
      userId,

      title: prompt,

      turns: [
        {
          prompt,

          responses: [
            {
              model: "Mistral",

              response: result.solution_1,

              score: result.judge.solution_1_score,

              reasoning: result.judge.solution_1_reasoning,
            },

            {
              model: "Cohere",

              response: result.solution_2,

              score: result.judge.solution_2_score,

              reasoning: result.judge.solution_2_reasoning,
            },
          ],

          winner,
        },
      ],
    });

    return res.status(201).json({
      success: true,
      data: chat,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getChats = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);

    const chats = await Chat.find({ userId }).sort({ updatedAt: -1 });

    return res.json({
      success: true,
      data: chats,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const followUpChat = async (req: Request, res: Response) => {
  const { chatId } = req.params;

  const { prompt } = req.body;

  const result = await runGraph(prompt);

  const winner =
    result.judge.solution_1_score > result.judge.solution_2_score
      ? "Mistral"
      : "Cohere";

  const chat = await Chat.findById(chatId);

  if (!chat) {
    return res.status(404).json({
      success: false,
      message: "Chat not found",
    });
  }

  chat.turns.push({
    prompt,

    responses: [
      {
        model: "Mistral",
        response: result.solution_1,
        score: result.judge.solution_1_score,
        reasoning: result.judge.solution_1_reasoning,
      },
      {
        model: "Cohere",
        response: result.solution_2,
        score: result.judge.solution_2_score,
        reasoning: result.judge.solution_2_reasoning,
      },
    ],

    winner,
  });

  await chat.save();

  return res.json({
    success: true,
    data: chat,
  });
};
