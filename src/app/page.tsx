"use client";

// 15:51 time
import { useEffect, useState } from "react";

export default function Home() {
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Connecting...");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onopen = () => {
      setConnectionStatus("Connected");
    };

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, `${data.time}: ${data.message}`]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE Error:", error);
      setConnectionStatus("Error connecting to server");
    };

    return () => {
      eventSource.close();
      setConnectionStatus("Disconnected");
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Dashboard Header */}
      <header className="px-8 py-6 flex justify-between items-center border-b bg-white dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Web Analytics Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{connectionStatus}</p>
      </header>

      {/* Display messages from server */}
      <main className="flex-1 p-8">
        <h2 className="text-xl font-semibold mb-4">Server Messages:</h2>
        <ul className="space-y-2">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <li
                key={index}
                className="p-4 bg-white dark:bg-gray-800 rounded shadow"
              >
                {msg}
              </li>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              No messages received yet.
            </p>
          )}
        </ul>
      </main>
    </div>
  );
}
