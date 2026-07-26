import express from "express";
import userMessage from "./services/graph.ai.services.js";

const app = express();

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.post("/ai-chat", async (req, res) => {
  await userMessage("give me the factorial in javascript???");
});

export default app;
