import React from 'react';
import OrderProgress from '../OrderDetail/OrderProgress';

const OrderDetailHeader = ({ order }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800">Đơn hàng #{order.id}</h2>
      </div>

      <OrderProgress order={order} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">Ngày đặt hàng</p>
          <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Tổng tiền</p>
          <p className="font-semibold text-green-700">{order.total?.toLocaleString()} đ</p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailHeader;
