import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

 export const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
 });


export const createChat = async (prompt:string) => {
  const { data } = await api.post("/chat", {
    prompt,
  });

  return data;
};

export const followUpChat = async (chatId: string, prompt: string) => {
  const { data } = await api.post(`/${chatId}/follow-up`, {
    prompt,
  });

  return data;
};

export const getChats = async () => {
  const { data } = await api.get("/chats");

  return data;
};