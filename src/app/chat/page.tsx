"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function ChatContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const setup = searchParams.get("setup");
    const action = searchParams.get("action");

    if (setup === "true") {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm James, your personal financial coach. I'd love to learn more about your goals so I can give you better advice. This will just take 3 minutes.\n\nLet's start with the big picture: What's your main financial goal right now? (For example: saving for a vacation, building an emergency fund, paying off debt, etc.)"
        }
      ]);
    } else if (action === "save20") {
      setMessages([
        {
          role: "assistant",
          content: "Great goal! Let me help you save 20% of your income this month. That would be $1,000.\n\nLooking at your spending, you currently save about $650/month. To reach $1,000, we need to find an extra $350.\n\nI can see a few opportunities:\n• Dining out: $230 (could cap at $150 = $80 saved)\n• Rideshare: $67 (could cap at $40 = $27 saved)\n• Shopping: $300 (could cap at $200 = $100 saved)\n• Subscriptions: Consider canceling unused ones = ~$30 saved\n\nThat's $237 right there! Would you like me to focus on one category first, or would you prefer a balanced approach across all categories?"
        }
      ]);
    } else if (action === "calculator") {
      setMessages([
        {
          role: "assistant",
          content: "I'm your quick spending calculator! Tell me what you're thinking of buying, and I'll help you figure out if it fits your budget and savings goals.\n\nFor example, you could ask:\n• \"Can I afford a $500 weekend trip and still save $1,000 this month?\"\n• \"Should I buy this $150 jacket if I want to save for vacation?\"\n• \"How much can I spend on dinner this week?\"\n\nWhat would you like to check?"
        }
      ]);
    } else {
      setMessages([
        {
          role: "assistant",
          content: "Hi! I'm James, your personal financial coach. I'm here to help you make smart spending decisions without sacrificing what matters most to you.\n\nI can help you:\n• Plan how to reach savings goals\n• Decide if a purchase fits your budget\n• Find ways to cut spending in categories you care less about\n• Calculate trade-offs for big purchases\n\nWhat's on your mind today?"
        }
      ]);
    }
  }, [searchParams]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    const newMessages = [...messages, { role: "user" as const, content: userMessage }];
    setMessages(newMessages);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response reader");
      }

      let assistantMessage = "";
      const decoder = new TextDecoder();

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                assistantMessage += parsed.content;
                setMessages(prev =>
                  prev.map((msg, idx) =>
                    idx === prev.length - 1
                      ? { ...msg, content: assistantMessage }
                      : msg
                  )
                );
              }
            } catch (e) {
              // Ignore JSON parse errors
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        {
          role: "assistant",
          content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-gray-900 mr-4"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Chat with James</h1>
            </div>
            <div className="text-sm text-gray-500">
              Your AI financial coach
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
        <div className="bg-white rounded-lg shadow-sm border h-full flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 p-4 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-pulse">James is thinking...</div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask James about your spending..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Send
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                onClick={() => setInput("Can I afford a $300 weekend trip and still save $1,000 this month?")}
                className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
              >
                Weekend trip affordability
              </button>
              <button
                onClick={() => setInput("How can I save $200 more this month without cutting dining out?")}
                className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
              >
                Save more without sacrificing
              </button>
              <button
                onClick={() => setInput("What subscriptions should I cancel?")}
                className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
              >
                Subscription review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Chat() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}