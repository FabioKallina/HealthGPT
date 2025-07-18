import React from 'react'

import "../css/Sidebar.css"

const Sidebar = ({ onNewChat, chats, onSelectChat, onDeleteChat }) => {
  return (
    <div className="sidebar">
        <button className="new-chat-btn" onClick={onNewChat}>
            + New Chat
        </button>
        <div className="chat-history">
            {chats.map((chat, index) => (
                <div
                    key={index}
                    className="chat-history-item"
                    onClick={() => onSelectChat(index)}
                >
                    {chat.title || `Chat ${index + 1}`}
                    <button onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id, index)
                    }} className="delete-btn">🅧</button>
                </div>
            ))}
        </div>
    </div>
  );
}

export default Sidebar