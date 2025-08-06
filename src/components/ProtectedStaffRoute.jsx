import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedStaffRoute = ({ children }) => {
  const userToken = localStorage.getItem('userToken');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  
  if (!userToken) {
    return <Navigate to="/login" replace />;
  }
  
  // Kiểm tra role có phải staff không
  if (userInfo.role !== 'staff') {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default ProtectedStaffRoute;
