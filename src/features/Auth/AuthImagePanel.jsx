import React from 'react';

const AuthImagePanel = ({ 
  imageUrl = "https://images.pexels.com/photos/7615567/pexels-photo-7615567.jpeg",
  alt = "auth visual",
  overlayOpacity = 20,
  backgroundColor = "bg-green-700"
}) => {
  return (
    <div className={`flex-1 ${backgroundColor} flex flex-col items-center justify-center relative`}>
      <div className={`absolute inset-0 bg-black bg-opacity-${overlayOpacity}`} />
      <img 
        src={imageUrl} 
        alt={alt} 
        className="w-full h-full object-cover absolute inset-0" 
      />
    </div>
  );
};

export default AuthImagePanel;
