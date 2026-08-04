import { Router } from "express";
import {
  createChat,
  followUpChat,
  getChats,
} from "../controllers/chat.controller.js";
import { authenticate } from "../middleware/auth.middleware..js";

const chatRouter = Router();

/*
@description: This endpoint handles chat messages sent by authenticated users. It processes the incoming message using AI services and returns a generated response. The endpoint is secured and requires a valid JWT token for access.
@route: POST /api/chat
@access: Private
*/
chatRouter.post("/chat", authenticate , createChat);

/*
@description: This endpoint retrieves all chat messages associated with the authenticated user. It returns a list of chat messages, allowing users to view their chat history. The endpoint is secured and requires a valid JWT token for access.
@route: GET /api/chats
@access: Private
*/
chatRouter.get("/chats", authenticate , getChats);

/* 
@description: This endpoint handles follow-up chat messages sent by authenticated users. It processes the incoming follow-up message using AI services and returns a generated response. The endpoint is secured and requires a valid JWT token for access.
@route: POST /api/follow-up
@access: Private
*/
chatRouter.post("/:chatId/follow-up", authenticate , followUpChat);

export default chatRouter;
