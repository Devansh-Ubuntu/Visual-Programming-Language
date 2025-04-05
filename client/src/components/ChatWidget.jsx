// src/components/ChatWidget.jsx
import React, { useState } from "react";
import ChatBaseChatBot from "./ChatBaseChatBot";
import "./ChatWidget.css";

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWidget = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="chat-widget-container">
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-header">
            <span>ChatBot</span>
            <button className="close-button" onClick={toggleWidget}>
              X
            </button>
          </div>
          <ChatBaseChatBot />
        </div>
      ) 
      : (
        <div className="chat-minimized" onClick={toggleWidget}>
          <span className="chat-icon">Chat</span>
        </div>
      )
      }
    </div>
  );
};

export default ChatWidget;
