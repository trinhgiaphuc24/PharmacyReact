import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import webSocketService from '../services/webSocketService';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const processedIds = useRef(new Set());

  useEffect(() => {
    if (user?.id) {
      const savedNotifications = localStorage.getItem(`notifications_${user.id}`);
      const savedUnreadCount = localStorage.getItem(`unreadCount_${user.id}`);
      
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications);
        const notificationsWithDates = parsed.map(notif => ({
          ...notif,
          timestamp: new Date(notif.timestamp)
        }));
        setNotifications(notificationsWithDates);
      }
      
      if (savedUnreadCount) {
        const count = parseInt(savedUnreadCount) || 0;
        setUnreadCount(count);
      }
    }
  }, [user?.id]);

  // Save notifications to localStorage khi có thay đổi
  useEffect(() => {
    if (user?.id && notifications.length >= 0) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(notifications));
      localStorage.setItem(`unreadCount_${user.id}`, unreadCount.toString());
    }
  }, [user?.id, notifications, unreadCount]);

  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      // Kiểm tra duplicate với notifications hiện tại
      const isDuplicate = prev.some(existing => 
        existing.data?.order_id === notification.data?.order_id &&
        existing.data?.type === notification.data?.type
      );
      
      if (isDuplicate) {
        return prev;
      }
      
      const newNotification = {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        isRead: false,
        ...notification
      };
      
      setUnreadCount(prevCount => prevCount + 1);
      return [newNotification, ...prev];
    });
  }, []);

  const handleWebSocketMessage = useCallback((data) => {
    const { type, order_id, title, message, timestamp } = data;
    const messageKey = `${type}_${order_id}_${timestamp}`;
    
    // Kiểm tra nếu đã xử lý message này rồi
    if (processedIds.current.has(messageKey)) {
      return;
    }
    
    // Đánh dấu đã xử lý
    processedIds.current.add(messageKey);
    
    // Xóa sau 30 giây để tránh memory leak (tăng thời gian để chắc chắn)
    // setTimeout(() => {
    //   processedIds.current.delete(messageKey);
    // }, 30000);
    
    // SỬ DỤNG FUNCTIONAL UPDATE VỚI IMMEDIATE RETURN ĐỂ TRÁNH DUPLICATE
    setNotifications(prev => {
      // Kiểm tra duplicate với notifications hiện tại (thêm timestamp check)
      const isDuplicate = prev.some(existing => 
        existing.data?.order_id === order_id &&
        existing.data?.type === type &&
        existing.data?.timestamp === timestamp
      );
      
      if (isDuplicate) {
        return prev; // RETURN NGAY LẬP TỨC
      }
      
      // Tạo unique ID để tránh duplicate
      const uniqueId = `${type}_${order_id}_${timestamp}_${Date.now()}_${Math.random()}`;
      
      const notificationData = {
        type: type,
        order_id: order_id,
        timestamp: timestamp
      };
      
      const newNotification = {
        id: uniqueId,
        timestamp: new Date(),
        isRead: false,
        title: title || 'Thông báo',
        body: message || '',
        data: { ...notificationData, ...data.data }
      };
      
      // CHỈ TĂNG UNREAD COUNT KHI THỰC SỰ THÊM NOTIFICATION MỚI
      setUnreadCount(prevCount => {
        return prevCount + 1;
      });
      
      return [newNotification, ...prev];
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      webSocketService.disconnect();
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    let isConnecting = false;

    const connectWebSocket = async () => {
      if (isConnecting) return;
      isConnecting = true;
      
      await webSocketService.connect(user.id);
      // Xóa listener cũ trước khi thêm mới
      webSocketService.off('all', handleWebSocketMessage);
      webSocketService.on('all', handleWebSocketMessage);
      isConnecting = false;
    };

    connectWebSocket();

    return () => {
      webSocketService.off('all', handleWebSocketMessage);
    };
  }, [user, isAuthenticated, handleWebSocketMessage]);

  // Function để cleanup notifications khi logout
  const clearAllNotifications = useCallback(() => {
    // Xóa tất cả notification localStorage
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('notifications_') || key.startsWith('unreadCount_')) {
        localStorage.removeItem(key);
      }
    });
    
    setNotifications([]);
    setUnreadCount(0);
    processedIds.current.clear();
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => {
      const updated = prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      );
      return updated;
    });
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
