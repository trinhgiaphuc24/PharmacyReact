import React from 'react';

const CustomerInfo = ({ 
  customerInfo, 
  setCustomerInfo, 
  isProcessing 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin khách hàng</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={customerInfo.lastName}
            onChange={(e) => setCustomerInfo({...customerInfo, lastName: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập tên khách hàng"
            required
            disabled={isProcessing}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={customerInfo.phoneNumber}
            onChange={(e) => setCustomerInfo({...customerInfo, phoneNumber: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Nhập số điện thoại"
            required
            disabled={isProcessing}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
