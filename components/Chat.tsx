"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import { ModelCombobox } from "@/components/ui/model-combobox";

interface AIModel {
  value: string;
  label: string;
}

export function Chat() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<AIModel[]>([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoadingModels, setIsLoadingModels] = useState(true);
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch("/api/models");
        const data = await response.json();
        setModels(data.models);
        // Set default model if available
        if (data.models.length > 0) {
          setSelectedModel(data.models[0].value);
        }
      } catch (error) {
        console.error("Error fetching models:", error);
      } finally {
        setIsLoadingModels(false);
      }
    };

    fetchModels();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading || !selectedModel) return;

    setIsLoading(true);
    try {
      const selectedModelLabel =
        models.find((m) => m.value === selectedModel)?.label || selectedModel;

      // Send user message to database
      await sendMessage({
        text: message,
        userId: "demo-user",
        userName: "Demo User",
        isAI: false,
      });

      // Send to Gemini API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          model: selectedModel,
        }),
      });

      const data = await response.json();

      if (data.response) {
        // Store AI response in database
        await sendMessage({
          text: data.response,
          userId: "ai",
          userName: `AI Assistant (${selectedModelLabel})`,
          isAI: true,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto p-4">
      <div className="mb-4">
        {isLoadingModels ? (
          <div className="h-10 w-[200px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
        ) : (
          <ModelCombobox
            value={selectedModel}
            onValueChange={setSelectedModel}
            models={models}
          />
        )}
      </div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow ${
              msg.isAI ? "border-l-4 border-blue-500" : ""
            }`}
          >
            <div className="font-semibold text-sm text-gray-600 dark:text-gray-300">
              {msg.userName}
            </div>
            <div className="mt-1">{msg.text}</div>
            <div className="text-xs text-gray-500 mt-2">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          disabled={isLoading || !selectedModel}
        />
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
            isLoading || !selectedModel ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading || !selectedModel}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
}
