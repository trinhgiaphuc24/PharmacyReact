import React from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaArrowRight } from 'react-icons/fa';

const EmptyOrders = () => {
  return (
    <div className="text-center py-16">
      <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-600 mb-4">Chưa có đơn hàng nào</h2>
      <p className="text-gray-500 mb-8">
        Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
      </p>
      
      <Link 
        to="/medicines" 
        className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
      >
        Bắt đầu mua sắm
        <FaArrowRight />
      </Link>
    </div>
  );
};

export default EmptyOrders;
