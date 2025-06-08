"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export function Chat() {
  const [message, setMessage] = useState("");
  const messages = useQuery(api.messages.list);
  const sendMessage = useMutation(api.messages.send);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // For demo purposes, using hardcoded user info
    // In a real app, you'd get this from your auth system
    await sendMessage({
      text: message,
      userId: "demo-user",
      userName: "Demo User",
    });
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages?.map((msg) => (
          <div
            key={msg._id}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
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
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
}
