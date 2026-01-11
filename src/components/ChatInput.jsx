// ChatInput.js
import React from "react";

const ChatInput = ({ inputMessage, setInputMessage, handleSendMessage }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();  // Gửi tin nhắn khi nhấn Enter
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        style={{ width: "80%", padding: "10px", marginRight: "10px" }}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default ChatInput;
