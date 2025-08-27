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
  const [sessionId, setSessionId] = useState(null);

  // Keys cho localStorage
  const STORAGE_KEYS = {
    SESSION_ID: 'chatbot_session_id',
    MESSAGES: 'chatbot_messages'
  };

  // Message mặc định
  const getDefaultMessages = () => ([
    {
      from: "bot",
      content: "Chào bạn! Tôi là chatbot tư vấn thuốc. Tôi có thể giúp gì cho bạn?",
    },
  ]);

  // Tạo session ID mới
  const generateNewSessionId = () => {
    return "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  };

  // Lưu session ID vào localStorage
  const saveSessionId = (id) => {
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, id);
  };

  // Lưu messages vào localStorage
  const saveMessages = (msgs) => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(msgs));
  };

  // Tạo dữ liệu mới
  const createNewSession = () => {
    const newSessionId = generateNewSessionId();
    const defaultMessages = getDefaultMessages();
    
    setSessionId(newSessionId);
    setMessages(defaultMessages);
    
    saveSessionId(newSessionId);
    saveMessages(defaultMessages);
  };

  // Xóa lịch sử chat (reset về trạng thái mặc định)
  const clearChatHistory = () => {
    createNewSession();
  };

  // Khởi tạo khi component mount
  useEffect(() => {
    const savedSessionId = localStorage.getItem(STORAGE_KEYS.SESSION_ID);
    const savedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    
    if (savedSessionId && savedMessages) {
      setSessionId(savedSessionId);
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error("Error parsing saved messages:", error);
        // Nếu parse lỗi, tạo message mặc định
        const defaultMessages = getDefaultMessages();
        setMessages(defaultMessages);
        saveMessages(defaultMessages);
      }
    } else {
      // Tạo session ID mới
      const newSessionId = generateNewSessionId();
      const defaultMessages = getDefaultMessages();
      
      setSessionId(newSessionId);
      setMessages(defaultMessages);
      
      saveSessionId(newSessionId);
      saveMessages(defaultMessages);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Lưu messages mỗi khi thay đổi
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot_messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Lắng nghe sự kiện clear chat từ logout
  useEffect(() => {
    const handleClearChat = () => {
      localStorage.removeItem(STORAGE_KEYS.SESSION_ID);
      localStorage.removeItem(STORAGE_KEYS.MESSAGES);
      
      // Tạo session mới
      const newSessionId = generateNewSessionId();
      const defaultMessages = getDefaultMessages();
      
      setSessionId(newSessionId);
      setMessages(defaultMessages);
      
      saveSessionId(newSessionId);
      saveMessages(defaultMessages);
      setShowChat(false);
    };

    window.addEventListener('chatbot:clear', handleClearChat);
    return () => window.removeEventListener('chatbot:clear', handleClearChat);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Gửi tin nhắn tới chatbot API
  const sendMessageToBot = async (userMessage) => {
    try {
      const response = await axios.post(endpoints.chatbot, {
        message: userMessage,
        session_id: sessionId,
      });

      console.log("API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi chatbot:", error);
      if (error.response?.status === 500) {
        return {
          response_type: "error",
          message: "Xin lỗi, hệ thống tư vấn đang gặp sự cố. Vui lòng thử lại sau ít phút.",
        };
      }
      return {
        response_type: "error",
        message: "Xin lỗi, tôi không thể kết nối được. Vui lòng kiểm tra kết nối internet và thử lại.",
      };
    }
  };

  // Thêm tin nhắn mới
  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  // Xóa typing indicator và thêm tin nhắn mới
  const replaceTypingMessage = (message) => {
    setMessages(prev => [
      ...prev.filter(msg => !msg.isTyping),
      message
    ]);
  };

  // Gửi tin nhắn từ form
  const handleSendMessage = async (userMessage) => {
    if (!userMessage.trim() || loading) return;

    setInput("");
    setLoading(true);

    // Thêm tin nhắn user
    addMessage({
      from: "user",
      content: userMessage,
    });

    // Thêm typing indicator
    addMessage({
      from: "bot", 
      content: "Đang trả lời...", 
      isTyping: true 
    });

    try {
      const botResponse = await sendMessageToBot(userMessage);
      
      // Xóa typing indicator và thêm phản hồi thật
      replaceTypingMessage({
        from: "bot",
        content: botResponse,
        isStructured: true,
      });
    } catch (error) {
      // Xóa typing indicator và hiển thị lỗi
      replaceTypingMessage({
        from: "bot",
        content: "Xin lỗi, tôi gặp sự cố khi xử lý câu hỏi của bạn. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    // States
    showChat,
    setShowChat,
    input,
    setInput,
    messages,
    setMessages,
    loading,
    setLoading,
    sessionId,

    // Functions
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
