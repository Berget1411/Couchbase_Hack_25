"use client";

import { useChat } from "@/hooks/api/use-chat";

export function Chat() {
  const { mutate: chat } = useChat();

  return (
    <div>
      <input type='text' />
      <button
        onClick={() => {
          chat("Hello");
        }}
      >
        Send
      </button>
    </div>
  );
}
