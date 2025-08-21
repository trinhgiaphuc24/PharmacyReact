import React from 'react';

const QuantitySelector = ({ quantity, onIncrement, onDecrement, label = "Số lượng:" }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <span className="font-semibold">{label}</span>
      <button 
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition" 
        onClick={onDecrement}
      >
        -
      </button>
      <span className="px-3 font-bold text-lg">{quantity}</span>
      <button 
        className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition" 
        onClick={onIncrement}
      >
        +
      </button>
    </div>
  );
};

export default QuantitySelector;
