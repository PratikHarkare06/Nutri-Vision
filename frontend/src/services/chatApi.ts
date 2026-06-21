import axios from "axios";
import { API_BASE_URL } from "./apiConfig";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export type ChatMessage = {
  role: "user" | "model";
  text: string;
};

export type ChatResponse = {
  success: boolean;
  text: string;
};

export const sendChatMessageRequest = async (
  message: string,
  history: ChatMessage[],
  pantryIngredients: string[]
): Promise<ChatResponse> => {
  const response = await api.post<ChatResponse>("/chat", {
    message,
    history,
    context: {
      pantryIngredients,
    },
  });
  return response.data;
};
