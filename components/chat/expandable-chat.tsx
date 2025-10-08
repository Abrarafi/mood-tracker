"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatHistory } from "./chat-history";
import {
  createChatSession,
  sendChatMessage,
  getChatHistory,
} from "@/lib/api/chat";

export function ExpandableChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const id = await createChatSession();
        setSessionId(id);
        const history = await getChatHistory(id);
        setMessages(
          history.map((m, idx) => ({
            id: `${idx}`,
            role: m.role,
            message: m.content,
            timestamp: m.timestamp,
          }))
        );
      } catch (error) {
        // ignore for now
      }
    };
    init();
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !sessionId) return;
    const userMsg = {
      id: `${Date.now()}`,
      role: "user" as const,
      message: input,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    try {
      const resp = await sendChatMessage(sessionId, userMsg.message);
      const aiMsg = {
        id: `${Date.now()}-ai`,
        role: "assistant" as const,
        message: resp.response || resp.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      // optionally show toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <ChatHistory messages={messages} />
      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" disabled={!sessionId || isLoading}>
          {isLoading ? "Sending..." : "Send"}
        </Button>
      </form>
    </div>
  );
}
