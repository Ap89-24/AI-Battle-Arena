import express from "express";
import runGraph from "./Ai/graph.ai.services.js";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.post("/ai-chat", async (req, res) => {
  const result = await runGraph("give me the factorial in javascript???");
  res.status(200).json(result);
});

export default app;
