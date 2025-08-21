import React from 'react';

const OrderItems = ({ items }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm đã đặt</h3>
      
      <div className="space-y-4">
        {items?.map((item, index) => (
          <div key={index} className="flex gap-4 p-4 border border-gray-200 rounded-lg">
            <img
              src={item.medicine_image || '/api/placeholder/80/80'}
              alt={item.medicine_name}
              className="w-20 h-20 object-cover rounded border"
            />
            <div className="flex-1">
              <h4 className="font-semibold text-gray-800">{item.medicine_name}</h4>
              <p className="text-gray-600">Số lượng: {item.quantity}</p>
              <p className="text-green-700 font-semibold">
                {(item.price * item.quantity).toLocaleString()} đ
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderItems;
