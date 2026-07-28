import {
  StateSchema,
  MessagesValue,
  ReducedValue,
  type GraphNode,
  StateGraph,
  START,
  END,
} from "@langchain/langgraph";
import { z } from "zod";
import { mistralModel, cohereModel, geminiModel } from "./model.ai.js";
import { HumanMessage } from "@langchain/core/messages";
import { createAgent, providerStrategy } from "langchain";

type JUDGEMENT = {
  winner: "solution_1" | "solution_2";
  solution_1_score: number;
  solution_2_score: number;
};

// type AIBATTLESTATE = {
//   message: typeof MessagesValue;
//   solution_1: string;
//   solution_2: string;
//   judgement: JUDGEMENT;
// };

const State = new StateSchema({
  problem: z.string().default(""),
  solution_1: z.string().default(""),
  solution_2: z.string().default(""),
  judge: z.object({
    solution_1_score: z.number().min(0).max(10),
    solution_2_score: z.number().min(0).max(10),
    solution_1_reasoning: z.string().default(""),
    solution_2_reasoning: z.string().default(""),
  }),
});

const solutionNode: GraphNode<typeof State> = async (state) => {
  const [mistralResponse, cohereResponse] = await Promise.all([
    mistralModel.invoke(state.problem),
    cohereModel.invoke(state.problem),
  ]);
  return {
    solution_1: mistralResponse.text,
    solution_2: cohereResponse.text,
  };
};

const judgeNode: GraphNode<typeof State> = async (state) => {
  const { problem, solution_1, solution_2 } = state;

  const judge = createAgent({
    model: geminiModel,
    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
      })
    ),
    systemPrompt: `You are a judge tasked with evaluating two solutions generate by different ai models. Please provide a score oout of 10 for each solution , along with your reasoning for each solution`,
  });

  const judgeResponse = judge.invoke({
    messages: [
      new HumanMessage(`
        Problem: ${problem},
        Solution 1: ${solution_1},
        Solution 2: ${solution_2},
        Please evaluate the two solutions and provide scores and along with their reasoning
        `),
    ],
  });

  const {
    solution_1_score,
    solution_2_score,
    solution_1_reasoning,
    solution_2_reasoning,
  } = (await judgeResponse).structuredResponse;

  return {
    judge: {
      solution_1_score,
      solution_2_score,
      solution_1_reasoning,
      solution_2_reasoning,
    },
  };
};

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)
  .compile();

export default async function userMessage(userMessage: string) {
  const result = await graph.invoke({
    message: [new HumanMessage(userMessage)],
  });

  console.log(result);
  return result.message;
}
