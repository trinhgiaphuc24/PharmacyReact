import React from 'react';

const LoadingSpinner = ({ message = "Đang tải..." }) => {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
