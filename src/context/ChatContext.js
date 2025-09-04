import React, { createContext, useContext, useState, useEffect } from 'react';
import axios, { endpoints } from '../utils/axiosConfig';

const ChatContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatContext);
  return context;
};

export const ChatProvider = ({ children }) => {
  const [showChat, setShowChat] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const STORAGE_KEYS = {MESSAGES: 'chatbot_messages'};

  const getDefaultMessages = () => ([
    {
      from: "bot",
      content: "Chào bạn! Tôi là chatbot tư vấn thuốc. Tôi có thể giúp gì cho bạn?",
    },
  ]);

  const saveMessages = (msgs) => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(msgs));
  };

  const createNewSession = () => {
    const defaultMessages = getDefaultMessages();
    
    setMessages(defaultMessages);
    saveMessages(defaultMessages);
  };

  const clearChatHistory = () => {
    createNewSession();
  };

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      setMessages(parsedMessages);
    } else {
      const defaultMessages = getDefaultMessages();
      setMessages(defaultMessages);
      saveMessages(defaultMessages);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot_messages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const handleClearChat = () => {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      const defaultMessages = getDefaultMessages();
      setMessages(defaultMessages);
      saveMessages(defaultMessages);
      setShowChat(false);
    };

    window.addEventListener('chatbot:clear', handleClearChat);
    return () => window.removeEventListener('chatbot:clear', handleClearChat);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
 
  const sendMessageToBot = async (userMessage) => {
    const response = await axios.post(endpoints.chatbot, {message: userMessage});
    return response.data;
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const replaceTypingMessage = (message) => {
    setMessages(prev => [
      ...prev.filter(msg => !msg.isTyping),
      message
    ]);
  };

  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim() || loading) return;

    setInput("");
    setLoading(true);
    addMessage({
      from: "user",
      content: userMessage,
    });
    addMessage({
      from: "bot", 
      content: "Đang trả lời...", 
      isTyping: true 
    });

    const botResponse = await sendMessageToBot(userMessage);
    replaceTypingMessage({
      from: "bot",
      content: botResponse,
      isStructured: true,
    });

    setLoading(false);
  };

  const value = {
    showChat,
    setShowChat,
    input,
    setInput,
    messages,
    setMessages,
    loading,
    setLoading,
    clearChatHistory,
    sendMessageToBot,
    addMessage,
    replaceTypingMessage,
    handleSendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
