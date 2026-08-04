import express from "express";
import cors from "cors";
import runGraph from "./Ai/graph.ai.services.js";
import morgan from "morgan";

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
  credentials: true,
}));

app.use(morgan("dev"));

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
