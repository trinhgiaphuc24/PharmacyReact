import React from 'react';

const PaymentInfo = ({ paymentMethod, shippingMethod }) => {
  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'cod': return 'Thanh toán khi nhận hàng';
      case 'vnpay': return 'VNPay';
      default: return method;
    }
  };

  const getShippingMethodText = (method) => {
    return method === 'store_pickup' ? 'Lấy tại cửa hàng' : 'Giao hàng tận nơi';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-500">Phương thức thanh toán:</span>
          <div className="font-medium">{getPaymentMethodText(paymentMethod)}</div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Hình thức giao hàng:</span>
          <div className="font-medium">{getShippingMethodText(shippingMethod)}</div>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
