import React from 'react';
import CartItem from './CartItem';

const CartItemList = ({ 
  cartItems, 
  isAllSelected, 
  onSelectAll, 
  onClearCart,
  onToggleSelection,
  onUpdateQuantity,
  onRemoveItem
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAllSelected()}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-lg font-semibold text-gray-800">
                Chọn tất cả ({cartItems.length} sản phẩm)
              </span>
            </label>
          </div>
          <button 
            onClick={onClearCart}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Xóa tất cả
          </button>
        </div>
      </div>
      
      <div className="divide-y">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onToggleSelection={onToggleSelection}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemoveItem}
          />
        ))}
      </div>
    </div>
  );
};

export default CartItemList;
