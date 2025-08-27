import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import staffWebSocketService from '../services/staffWebSocketService';

const StaffNotificationContext = createContext();

export const useStaffNotifications = () => {
  const context = useContext(StaffNotificationContext);
  return context;
};

export const StaffNotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated, isStaff } = useAuth();

  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      isRead: false,
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    return newNotification;
  }, []);

  const handleWebSocketMessage = useCallback((data) => {
    const { type } = data;
    
    if (type === 'new_order_notification') {
      addNotification({
        title: 'Đơn hàng mới',
        body: data.message,
        data: {
          type: 'new_order',
          order_id: data.order_id,
          customer: data.customer,
          total: data.total,
          timestamp: data.timestamp
        }
      });
    }
  }, [addNotification]);

  useEffect(() => {
    if (!isAuthenticated || !user || !isStaff()) {
      staffWebSocketService.disconnect();
      return;
    }

    const connectWebSocket = async () => {
      try {
        await staffWebSocketService.connect();
        staffWebSocketService.on('all', handleWebSocketMessage);
      } catch (error) {
        console.error('Staff WebSocket connection failed:', error);
      }
    };

    connectWebSocket();

    return () => {
      staffWebSocketService.disconnect();
    };
  }, [user, isAuthenticated, isStaff, handleWebSocketMessage]);

  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead
  };

  return (
    <StaffNotificationContext.Provider value={value}>
      {children}
    </StaffNotificationContext.Provider>
  );
};

export default StaffNotificationContext;
