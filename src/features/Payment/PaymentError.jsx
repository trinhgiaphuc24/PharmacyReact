import React from 'react';
import { Link } from 'react-router-dom';
import { FaTimesCircle } from 'react-icons/fa';

const PaymentError = ({ paymentResult }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Thanh toán thất bại
      </h1>
      <p className="text-gray-600 mb-6">
        {paymentResult?.message}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to="/orders"
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition font-semibold"
        >
          Xem đơn hàng của tôi
        </Link>
        <Link
          to="/"
          className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
};

export default PaymentError;
