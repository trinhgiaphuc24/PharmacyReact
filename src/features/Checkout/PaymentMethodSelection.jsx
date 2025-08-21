import React from 'react';
import { FaCreditCard, FaWallet } from 'react-icons/fa';

const PaymentMethodSelection = ({ paymentMethod, onPaymentMethodChange }) => {
  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán tiền mặt khi nhận hàng",
      icon: FaCreditCard,
      description: "Thanh toán khi nhận hàng",
    },
    {
      id: "vnpay",
      name: "Thanh toán qua VNPay",
      icon: FaWallet,
      description: "Ví điện tử VNPay",
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Chọn phương thức thanh toán
      </h2>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const IconComponent = method.icon;
          return (
            <label
              key={method.id}
              className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                paymentMethod === method.id
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                value={method.id}
                checked={paymentMethod === method.id}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="w-4 h-4 text-green-700 border-gray-300 focus:ring-green-500"
              />
              <IconComponent className="text-lg text-gray-600" />
              <div>
                <div className="font-medium text-gray-800">
                  {method.name}
                </div>
                <div className="text-sm text-gray-500">
                  {method.description}
                </div>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
