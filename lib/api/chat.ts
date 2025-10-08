import api from "../api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  metadata?: {
    technique: string;
    goal: string;
    progress: any[];
    analysis?: {
      emotionalState: string;
      themes: string[];
      riskLevel: number;
      recommendedApproach: string;
      progressIndicators: string[];
    };
  };
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse {
  message: string;
  response?: string;
  analysis?: {
    emotionalState: string;
    themes: string[];
    riskLevel: number;
    recommendedApproach: string;
    progressIndicators: string[];
  };
  metadata?: {
    technique: string;
    goal: string;
    progress: any[];
  };
}

// Using shared axios client with baseURL and withCredentials

export const createChatSession = async (): Promise<string> => {
  try {
    const { data } = await api.post<{ sessionId: string }>("/chat/sessions");
    return data.sessionId;
  } catch (error) {
    console.error("Error creating chat session:", error);
    throw error;
  }
};

export const sendChatMessage = async (
  sessionId: string,
  message: string
): Promise<ApiResponse> => {
  try {
    const { data } = await api.post<ApiResponse>(
      `/chat/sessions/${sessionId}/messages`,
      { message }
    );
    return data;
  } catch (error) {
    console.error("Error sending chat message:", error);
    throw error;
  }
};

export const getChatHistory = async (
  sessionId: string
): Promise<ChatMessage[]> => {
  try {
    const { data } = await api.get<ChatMessage[]>(
      `/chat/sessions/${sessionId}/history`
    );
    return data.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      metadata: msg.metadata,
    }));
  } catch (error) {
    console.error("Error fetching chat history:", error);
    throw error;
  }
};

export const getAllChatSessions = async (): Promise<ChatSession[]> => {
  try {
    const { data } = await api.get<any[]>(`/chat/sessions`);
    return data.map((session: any) => {
      const createdAt = new Date(session.createdAt || Date.now());
      const updatedAt = new Date(session.updatedAt || Date.now());
      return {
        ...session,
        createdAt: isNaN(createdAt.getTime()) ? new Date() : createdAt,
        updatedAt: isNaN(updatedAt.getTime()) ? new Date() : updatedAt,
        messages: (session.messages || []).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp || Date.now()),
        })),
      } as ChatSession;
    });
  } catch (error) {
    console.error("Error fetching chat sessions:", error);
    throw error;
  }
};
