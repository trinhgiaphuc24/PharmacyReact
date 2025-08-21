import React from 'react';

const SubmitButton = ({ 
  children, 
  isLoading = false, 
  loadingText = "Đang xử lý...", 
  className = "",
  disabled = false,
  ...props 
}) => {
  return (
    <button 
      type="submit" 
      disabled={isLoading || disabled}
      className={`w-full font-semibold py-3 rounded-lg transition ${
        isLoading || disabled
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
          : 'bg-green-700 hover:bg-green-800 text-white'
      } ${className}`}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};

export default SubmitButton;
