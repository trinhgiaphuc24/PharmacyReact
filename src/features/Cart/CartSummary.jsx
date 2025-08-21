import React from 'react';
import { Link } from 'react-router-dom';

const CartSummary = ({ selectedItems, selectedAmount, onCheckout }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm sticky top-4">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Tóm tắt đơn hàng</h2>
        {selectedItems === 0 && (
          <p className="text-sm text-amber-600 mt-2">
            Vui lòng chọn sản phẩm để thanh toán
          </p>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính ({selectedItems} sản phẩm)</span>
          <span>{selectedAmount.toLocaleString()} đ</span>
        </div>
        
        <hr className="my-3" />
        
        <div className="flex justify-between text-lg font-bold text-gray-800">
          <span>Tổng cộng</span>
          <span className="text-green-700">{selectedAmount.toLocaleString()} đ</span>
        </div>
      </div>
      
      <div className="p-4 space-y-3">
        <button 
          onClick={onCheckout}
          className={`w-full py-3 rounded-lg font-semibold transition ${
            selectedItems > 0 
              ? 'bg-green-700 text-white hover:bg-green-800' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={selectedItems === 0}
        >
          {selectedItems > 0 
            ? 'Thanh toán' 
            : 'Chọn sản phẩm để thanh toán'
          }
        </button>
        
        <Link 
          to="/medicines"
          className="block w-full text-center bg-white border border-green-700 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );
};

export default CartSummary;
