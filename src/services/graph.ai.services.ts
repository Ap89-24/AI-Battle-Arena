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
import { mistralModel, cohereModel , geminiModel } from "./model.services.js";
import { HumanMessage } from "@langchain/core/messages";
import { createAgent , providerStrategy } from "langchain";


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
  message: MessagesValue,
  solution_1: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  solution_2: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => {
      return next;
    },
  }),
  judgement: new ReducedValue(
    z.object({
    solution_1_score: z.number().default(0),
    solution_2_score: z.number().default(0),
    }),
    {
      reducer: (current, next) => {
        return next;
      },
    }
  ),
});

const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {
  const userMessage = state.message[0];
  if (!userMessage) {
  throw new Error("No message found in graph state.");
}
  const [mistral_solution, cohere_solution] = await Promise.all([
    mistralModel.invoke(userMessage.text),
    cohereModel.invoke(userMessage.text),
  ]);

  return {
    solution_1: mistral_solution.text,
    solution_2: cohere_solution.text,
  };
};

const judgeNode: GraphNode<typeof State> = async (state: typeof State) => { 
  const { solution_1, solution_2 } = state;
  const judge = createAgent({
    model: geminiModel,
    tools: [],
    responseFormat: providerStrategy(z.object({
      solution_1_score: z.number().min(0).max(10),
      solution_2_score: z.number().min(0).max(10),
    }))
  })

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
        You are a judge tasked with evaluating the quality of two solutions to a problem. The problem is: ${state.message[0].text}. The first solution is: ${solution_1}. The second solution is: ${solution_2}. Please provide a score between 0 and 10 for each solution, where 0 means the solution is completely incorrect or irrelevant , and 10 means the solution is perfect and fullt addressed the problem.
        `)
    ]
  })

  const result = judgeResponse.structuredResponse

  return {
    judgement: result
  }
};

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)
  .addEdge(START, "solution")
  .addEdge("solution" , "judge")
  .addEdge("judge", END)
  .compile();

export default async function userMessage(userMessage: string) {
  const result = await graph.invoke({
    message: [new HumanMessage(userMessage)],
  });

  console.log(result);
  return result.message;
}
