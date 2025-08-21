import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartItem = ({ 
  item, 
  onToggleSelection, 
  onUpdateQuantity, 
  onRemove 
}) => {
  return (
    <div className={`p-4 transition-colors ${item.selected ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="flex gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 flex items-start pt-2">
          <input
            type="checkbox"
            checked={item.selected || false}
            onChange={() => onToggleSelection(item.id)}
            className="w-4 h-4 text-green-700 border-gray-300 rounded focus:ring-green-500"
          />
        </div>
        
        {/* Hình ảnh sản phẩm */}
        <div className="flex-shrink-0">
          <img
            src={item.image}
            alt={item.name}
            className={`w-20 h-20 object-cover rounded-lg border transition-opacity ${
              item.selected ? 'opacity-100' : 'opacity-50'
            }`}
          />
        </div>
        
        {/* Thông tin sản phẩm */}
        <div className="flex-1">
          <Link 
            to={`/medicines/${item.id}`}
            className={`font-medium hover:text-green-700 line-clamp-2 ${
              item.selected ? 'text-gray-800' : 'text-gray-500'
            }`}
          >
            {item.name}
          </Link>
          <div className={`text-sm mt-1 ${item.selected ? 'text-gray-500' : 'text-gray-400'}`}>
            <span className="mr-4">Loại: {item.genre}</span>
            <span>Xuất xứ: {item.produce}</span>
          </div>
          <div className={`font-bold text-lg mt-2 ${item.selected ? 'text-green-700' : 'text-gray-400'}`}>
            {(item.price || 0).toLocaleString()} đ
          </div>
        </div>
        
        {/* Điều khiển số lượng */}
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onRemove(item)}
            className="text-red-500 hover:text-red-700 p-1"
            title="Xóa sản phẩm"
          >
            <FaTrash />
          </button>
          
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
              className={`p-2 hover:bg-gray-100 transition ${
                !item.selected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!item.selected}
            >
              <FaMinus className="text-sm" />
            </button>
            <span className={`px-4 py-2 min-w-[50px] text-center font-medium ${
              item.selected ? 'text-gray-800' : 'text-gray-400'
            }`}>
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
              className={`p-2 hover:bg-gray-100 transition ${
                !item.selected ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={!item.selected}
            >
              <FaPlus className="text-sm" />
            </button>
          </div>
          
          <div className={`font-bold ${item.selected ? 'text-green-700' : 'text-gray-400'}`}>
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
