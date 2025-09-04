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
      className={`w-full font-semibold py-3 rounded-lg transition flex items-center justify-center ${
        isLoading || disabled
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
          : 'bg-green-700 hover:bg-green-800 text-white'
      } ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          {loadingText}
        </>
      ) : children}
    </button>
  );
};

export default SubmitButton;
