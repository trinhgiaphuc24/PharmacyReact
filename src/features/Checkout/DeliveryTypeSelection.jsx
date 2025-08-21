import React from 'react';
import { FaTruck, FaStore } from 'react-icons/fa';

const DeliveryTypeSelection = ({ deliveryType, onDeliveryTypeChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Chọn hình thức nhận hàng
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label
          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
            deliveryType === "pickup"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="deliveryType"
            value="pickup"
            checked={deliveryType === "pickup"}
            onChange={(e) => onDeliveryTypeChange(e.target.value)}
            className="w-4 h-4 text-green-700 border-gray-300 focus:ring-green-500"
          />
          <FaStore className="text-lg text-green-700" />
          <div>
            <div className="font-medium text-gray-800">
              Nhận hàng tại nhà thuốc
            </div>
            <div className="text-sm text-gray-500">
              Đến nhà thuốc để nhận hàng
            </div>
          </div>
        </label>

        <label
          className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
            deliveryType === "delivery"
              ? "border-green-500 bg-green-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <input
            type="radio"
            name="deliveryType"
            value="delivery"
            checked={deliveryType === "delivery"}
            onChange={(e) => onDeliveryTypeChange(e.target.value)}
            className="w-4 h-4 text-green-700 border-gray-300 focus:ring-green-500"
          />
          <FaTruck className="text-lg text-green-700" />
          <div>
            <div className="font-medium text-gray-800">
              Giao hàng tận nơi
            </div>
            <div className="text-sm text-gray-500">
              Giao hàng đến địa chỉ của bạn
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default DeliveryTypeSelection;
