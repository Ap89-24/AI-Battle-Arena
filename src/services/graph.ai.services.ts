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
import { mistralModel, cohereModel } from "./model.services.js";
import { HumanMessage } from "@langchain/core/messages";

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
    z.object().default({
      solution_1_score: 0,
      solution_2_score: 0,
    }),
    {
      reducer: (current, next) => {
        return next;
      },
    }
  ),
});

const solutionNode: GraphNode<typeof State> = async (state: typeof State) => {
  const [mistral_solution, cohere_solution] = Promise.all([
    mistralModel.invoke(state.messages[0].text),
    cohereModel.invoke(state.messages[0].text),
  ]);

  return {
    solution_1: mistral_solution.text,
    solution_2: cohere_solution.text,
  };
};

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addEdge(START, "solution")
  .addEdge("solution", END)
  .compile();

export default async function userMessage(userMessage: string) {
  const result = await graph.invoke({
    message: [new HumanMessage(userMessage)],
  });

  console.log(result);
  return result.messages;
}
