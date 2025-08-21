import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const PaymentSuccess = ({ paymentResult, orderInfo }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8 text-center">
      <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Thanh toán thành công!
      </h1>
      <p className="text-gray-600 mb-6">
        {paymentResult.message}
      </p>
      
      {orderInfo && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-2">Thông tin đơn hàng:</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">Mã đơn hàng:</span> #{orderInfo.order_id}</p>
            <p><span className="font-medium">Tổng tiền:</span> {orderInfo.total?.toLocaleString()} đ</p>
            <p><span className="font-medium">Trạng thái:</span> {
              orderInfo.order_status === 'waiting_for_pickup' ? 'Chờ lấy hàng' :
              orderInfo.order_status === 'waiting_for_delivery' ? 'Chờ giao hàng' :
              orderInfo.order_status
            }</p>
          </div>
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          to={orderInfo ? `/order-detail/${orderInfo.order_id}` : '/orders'}
          className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition font-semibold"
        >
          Xem chi tiết đơn hàng
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

export default PaymentSuccess;
