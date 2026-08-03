import express from "express";
import runGraph from "./Ai/graph.ai.services.js";

const app = express();



app.post("/invoke", async (req, res) => {
  const { prompt } = req.body;
  const result = await runGraph(prompt);
  res.status(200).json({
    message: "Graph AI invoked successfully",
    success: true,
    data: result
  });
});

export default app;
