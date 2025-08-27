import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaClipboardList } from 'react-icons/fa';

const SuccessActions = ({ orderId }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link 
        to="/medicines" 
        className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
      >
        <FaShoppingCart />
        Tiếp tục mua sắm
      </Link>
      
      <Link 
        to={orderId ? `/orders/${orderId}` : "/orders"}
        className="inline-flex items-center gap-2 bg-white border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
      >
        <FaClipboardList />
        Theo dõi đơn hàng
      </Link>
    </div>
  );
};

export default SuccessActions;
