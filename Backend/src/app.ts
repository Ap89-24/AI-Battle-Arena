import express from "express";
import cors from "cors";
import morgan from "morgan";
import chatRouter from "./routes/chat.route.js";
import { clerkMiddleware } from "@clerk/express";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(morgan("dev"));

// ✅ Register Clerk BEFORE routes
app.use(clerkMiddleware());

app.use("/api", chatRouter);

export default app;
