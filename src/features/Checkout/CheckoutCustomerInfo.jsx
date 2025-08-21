import React from 'react';
import { FaUser } from 'react-icons/fa';

const CheckoutCustomerInfo = ({ user }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaUser className="text-green-700" />
        <h2 className="text-lg font-semibold text-gray-800">
          Thông tin người đặt
        </h2>
      </div>
      <div className="space-y-2">
        <div className="flex items-center">
          <span className="w-32 text-gray-700 font-medium">
            Họ và tên:
          </span>
          <span className="text-gray-900">
            {user?.first_name + " " + user?.last_name || ""}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-gray-700 font-medium">
            Số điện thoại:
          </span>
          <span className="text-gray-900">
            {user?.phone_number || ""}
          </span>
        </div>
        <div className="flex items-center">
          <span className="w-32 text-gray-700 font-medium">
            Email:
          </span>
          <span className="text-gray-900">{user?.email || ""}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCustomerInfo;
