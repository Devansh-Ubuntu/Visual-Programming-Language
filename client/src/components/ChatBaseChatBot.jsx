// src/components/ChatBaseChatBot.jsx
import React from "react";

const ChatBaseChatBot = () => {
  return (
    <iframe
      src="https://www.chatbase.co/chatbot-iframe/wqh3JaT28-DwBxfJdd6ra"
      title="ChatBase Chatbot"
      style={{
        width: "100%",
        height: "700px", // Adjust height as needed
        border: "none",
      }}
      allow="microphone; camera" // If your bot needs access to these features
    />
  );
};

export default ChatBaseChatBot;
