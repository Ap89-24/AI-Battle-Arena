import { ChatGoogle } from "@langchain/google";
import Config from "../config/config.js";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatCohere } from "@langchain/cohere"


export const geminiModel = new ChatGoogle({
    model: "gemini-flash-latest",
    apiKey: Config.GOOGLE_API_KEY
});


export const mistralModel = new ChatMistralAI({
    model: "mistral-medium-latest",
    apiKey: Config.MISTRAL_API_KEY
});


export const cohereModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: Config.COHERE_API_KEY
});