import React from 'react';

const ActionButtons = ({ onAddToCart, onBuyNow }) => {
  return (
    <div className="flex gap-4 mb-4">
      <button 
        className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition shadow"
        onClick={onBuyNow}
      >
        Mua ngay
      </button>
      <button 
        className="bg-white border border-green-700 text-green-700 font-semibold px-6 py-3 rounded-lg transition shadow hover:bg-green-50"
        onClick={onAddToCart}
      >
        Thêm vào giỏ
      </button>
    </div>
  );
};

export default ActionButtons;
