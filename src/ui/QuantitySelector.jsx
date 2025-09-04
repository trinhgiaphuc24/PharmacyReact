import React from 'react';

const QuantitySelector = ({ 
  quantity, 
  onIncrement, 
  onDecrement, 
  label = "Số lượng:", 
  maxQuantity = null,
  showStock = false 
}) => {
  const isDecrementDisabled = quantity <= 1;
  const isIncrementDisabled = maxQuantity !== null && quantity >= maxQuantity;

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2">
        <span className="font-semibold">{label}</span>
        <button 
          className={`px-2 py-1 rounded transition ${
            isDecrementDisabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={onDecrement}
          disabled={isDecrementDisabled}
        >
          -
        </button>
        <span className="px-3 font-bold text-lg">{quantity}</span>
        <button 
          className={`px-2 py-1 rounded transition ${
            isIncrementDisabled 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={onIncrement}
          disabled={isIncrementDisabled}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;
