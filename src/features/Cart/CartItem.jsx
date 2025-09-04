import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import QuantitySelector from '../../ui/QuantitySelector';

const CartItem = ({ 
  item, 
  onToggleSelection, 
  onUpdateQuantity, 
  onRemove 
}) => {
  // Check if item should be disabled due to insufficient stock
  const isOutOfStock = item.stock === 0;
  const isLowStock = item.stock > 0 && item.stock < item.quantity; // Warning but not disabled
  const isDisabled = isOutOfStock; // Only disable when completely out of stock

  const handleIncrement = () => {
    if (item.selected && !isDisabled) {
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.selected && !isDisabled) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <div className={`p-4 transition-colors relative ${
      isDisabled 
        ? 'bg-gray-100 opacity-60' 
        : item.selected 
          ? 'bg-white' 
          : 'bg-gray-50'
    }`}>
      {/* Overlay for disabled state */}
      {/* {isDisabled && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium">
            Hết hàng
          </div>
        </div>
      )} */}
      
      {/* Warning for low stock but not disabled */}
      {isLowStock && !isDisabled && (
        <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-medium z-10">
          Chỉ còn {item.stock} sản phẩm
        </div>
      )}
      
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 flex items-start pt-2">
          <input
            type="checkbox"
            checked={item.selected || false}
            onChange={() => !isDisabled && onToggleSelection(item.id)}
            className={`w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-500 ${
              isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
            }`}
            disabled={isDisabled}
          />
        </div>
        
        {/* Hình ảnh sản phẩm */}
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className={`w-20 h-20 object-cover rounded-lg border transition-opacity ${
              isDisabled 
                ? 'opacity-30' 
                : item.selected 
                  ? 'opacity-100' 
                  : 'opacity-50'
            }`}
          />
        </div>
        
        {/* Thông tin sản phẩm */}
        <div className="flex-1">
          <Link 
            to={`/medicines/${item.id}`}
            className={`font-medium hover:text-green-700 line-clamp-2 ${
              isDisabled 
                ? 'text-gray-400 pointer-events-none' 
                : item.selected 
                  ? 'text-gray-800' 
                  : 'text-gray-500'
            }`}
          >
            {item.name}
          </Link>
          <div className={`text-sm mt-1 ${
            isDisabled 
              ? 'text-gray-400' 
              : item.selected 
                ? 'text-gray-500' 
                : 'text-gray-400'
          }`}>
            <span className="mr-4">Loại: {item.genre}</span>
            <span className="mr-4">Xuất xứ: {item.produce}</span>
            <span className={`${
              isOutOfStock 
                ? 'text-red-600 font-bold' 
                : isLowStock
                  ? 'text-orange-600 font-medium'
                : item.stock <= 10 
                  ? 'text-orange-600 font-medium' 
                  : ''
            }`}>
              Kho: {item.stock}
            </span>
          </div>
          <div className={`font-bold text-lg mt-2 ${
            isDisabled 
              ? 'text-gray-400' 
              : item.selected 
                ? 'text-green-700' 
                : 'text-gray-400'
          }`}>
            {(item.price || 0).toLocaleString()} đ
          </div>
        </div>
        
        {/* Điều khiển số lượng */}
        <div className="flex flex-col items-end gap-2 relative z-20">
          <button
            onClick={() => onRemove(item)}
            className="text-red-500 hover:text-red-700 p-1 pointer-events-auto"
            title="Xóa sản phẩm"
          >
            <FaTrash />
          </button>
          
          <div className={`${
            !item.selected || isDisabled 
              ? 'opacity-50 pointer-events-none' 
              : ''
          }`}>
            <QuantitySelector
              quantity={item.quantity}
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              label=""
              maxQuantity={item.stock}
              showStock={false}
            />
          </div>
          
          <div className={`font-bold ${
            isDisabled 
              ? 'text-gray-400' 
              : item.selected 
                ? 'text-green-700' 
                : 'text-gray-400'
          }`}>
            {(item.total_price !== undefined 
              ? item.total_price 
              : ((item.price || 0) * item.quantity)
            ).toLocaleString()} đ
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
