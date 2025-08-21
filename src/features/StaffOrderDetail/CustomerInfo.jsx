import React from 'react';

const CustomerInfo = ({ customer }) => {
  if (!customer) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin khách hàng</h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-500">Họ tên:</span>
          <div className="font-medium">{customer.user_name}</div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Email:</span>
          <div className="font-medium">{customer.email}</div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Số điện thoại:</span>
          <div className="font-medium">{customer.phone_number}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
