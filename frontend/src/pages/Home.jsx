import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";

import "../css/Home.css";
import logo1 from "../images/logo.png";
import { FaCog } from "react-icons/fa";

const Home = () => {
  const [message, setMessage] = useState("");
  const [allChats, setAllChats] = useState([]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const chatContainerRef = useRef(null);

  const chatHistory = allChats[currentChatIndex]?.messages || [];

  const handleSend = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    const updatedChat = [...chatHistory, userMsg];
    updateChatHistory((prev) => [...prev, userMsg]);
    setMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3000/api/chat",
        {
          messages: updatedChat,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const aiMsg = { sender: "ai", text: res.data.response };
      updateChatHistory(currentChatIndex, [...updatedChat, aiMsg]);
    } catch (error) {
      const errorMsg = { sender: "ai", text: "Oops! Something went wrong." };
      updateChatHistory(currentChatIndex, [...updatedChat, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:3000/api/chat/chats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const chats = res.data.data; // full chat objects

      setAllChats(chats); // save full chat objects directly
    } catch (error) {
      console.error("Failed getting chat history", error);
    }
  };

  const handleDeleteChat = async (chatId, index) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:3000/api/chat/${chatId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAllChats((prevChats) => {
        const newChats = [...prevChats];
        newChats.splice(index, 1);
        return newChats;
      });

      if (currentChatIndex >= allChats.length - 1) {
        setCurrentChatIndex(Math.max(0, allChats.length - 2));
      }
    } catch (error) {
      console.error("Failed to delete chat", error);
    }
  };

  const fetchUserEmail = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const userObj = JSON.parse(user);
      setUserEmail(userObj.email || "");
    }
  };

  const updateChatHistory = (index, newMessages) => {
  setAllChats((prevChats) => {
    const newChats = [...prevChats];
    const chat = newChats[index];
    if (chat) {
      newChats[index] = {
        ...chat,
        messages: newMessages,
      };
    }
    return newChats;
  });
};

  const handleNewChat = () => {
    const newChat = {
      _id: `temp-${Date.now()}`, // optional: temporary ID to avoid undefined
      messages: [],
    };
    setAllChats((prev) => [...prev, newChat]);
    setCurrentChatIndex(allChats.length);
  };

  const handleSelectChat = (index) => {
    setCurrentChatIndex(index);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, loading]);

  useEffect(() => {
    fetchChatHistory();
    fetchUserEmail();
  }, []);
  return (
    <div className="app-container">
      <Sidebar
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        chats={allChats.map((chat, i) => ({
          id: chat._id,
          title:
            chat.messages
              .find((msg) => msg.sender === "user")
              ?.text?.slice(0, 30) || "New Chat",
        }))}
      />
      <div className="chat-page">
        <div className="header-container">
          <img src={logo1} className="logo-img" />
          <header className="chat-header">HealthGPT</header>
          <div onClick={() => setMenuOpen(!menuOpen)}>
            <FaCog size={24} color="#253B6E" className="cog-menu" />
          </div>
        </div>

        {menuOpen && (
          <div className="popup-menu">
            <p className="popup-text">{userEmail}</p>
            <a href="/login" className="popup-text">
              Log Out
            </a>
          </div>
        )}

        <main className="chat-container" ref={chatContainerRef}>
          {chatHistory.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                msg.sender === "user" ? "user-bubble" : "ai-bubble"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && <div className="chat-bubble ai-bubble">Typing...</div>}
        </main>

        <footer className="chat-input-area">
          <input
            type="text"
            placeholder="Ask a health question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button onClick={handleSend} disabled={loading}>
            Send
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Home;
