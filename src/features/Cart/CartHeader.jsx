import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

const CartHeader = ({ totalItems, selectedItems }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <FaShoppingCart className="text-2xl text-green-700" />
        <h1 className="text-3xl font-bold text-gray-800">Giỏ hàng</h1>
        <div className="flex gap-2">
          <span className="border border-green-700 text-green-700 text-sm px-2 py-1 rounded-full">
            {totalItems} sản phẩm
          </span>
          {selectedItems !== totalItems && (
            <span className="bg-green-700 text-white text-sm px-2 py-1 rounded-full">
              {selectedItems} được chọn
            </span>
          )}
        </div>
      </div>
      <Link 
        to="/medicines" 
        className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
      >
        <FaArrowLeft />
        Tiếp tục mua sắm
      </Link>
    </div>
  );
};

export default CartHeader;
