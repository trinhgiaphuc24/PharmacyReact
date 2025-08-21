import React from 'react';

const OrderProgress = ({ order }) => {
  const getOrderStatuses = (shippingMethod) => {
    if (shippingMethod === 'store_pickup') {
      return [
        { key: 'pending', label: 'Chờ xác nhận' },
        { key: 'waiting_for_pickup', label: 'Chờ lấy hàng' },
        { key: 'delivered', label: 'Đã giao' },
        { key: 'canceled', label: 'Đã hủy' },
      ];
    } else {
      return [
        { key: 'pending', label: 'Chờ xác nhận' },
        { key: 'waiting_for_pickup', label: 'Chờ lấy hàng' },
        { key: 'waiting_for_delivery', label: 'Chờ giao hàng' },
        { key: 'delivered', label: 'Đã giao' },
        { key: 'canceled', label: 'Đã hủy' },
      ];
    }
  };

  const getStatusIndex = (status, shippingMethod) => {
    if (status === 'canceled' || status === 'returned') return -1;
    const statuses = getOrderStatuses(shippingMethod);
    return statuses.findIndex(s => s.key === status);
  };

  const shippingMethod = order.online_order?.shipping_method;
  const currentStatuses = getOrderStatuses(shippingMethod);
  const currentIndex = getStatusIndex(order.status, shippingMethod);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
        {/* Progress Line Active */}
        <div 
          className={`absolute top-1/2 left-0 h-1 -translate-y-1/2 transition-all duration-500 z-0 ${order.status === 'canceled' ? 'bg-red-500' : 'bg-green-500'}`}
          style={{ 
            width: `${currentIndex >= 0 ? (currentIndex / (currentStatuses.length - 1)) * 100 : 0}%` 
          }}
        ></div>
        {currentStatuses.map((status, index) => {
          const isCanceled = status.key === 'canceled';
          
          if (order.status === 'canceled') {
            return (
              <div key={status.key} className="flex flex-col items-center z-10 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-300 ${
                  isCanceled ? 'bg-red-600 text-white ring-4 ring-red-200' : 'bg-gray-300 text-gray-500'
                }`}>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${
                    isCanceled ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    {status.label}
                  </p>
                </div>
              </div>
            );
          } else {
            const currentIndex = getStatusIndex(order.status, shippingMethod);
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            return (
              <div key={status.key} className="flex flex-col items-center z-10 bg-white px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-all duration-300 ${
                  isCurrent 
                    ? (isCanceled ? 'bg-red-600 text-white ring-4 ring-red-200' : 'bg-green-600 text-white ring-4 ring-green-200')
                    : isActive 
                      ? (isCanceled ? 'bg-red-500 text-white' : 'bg-green-500 text-white')
                      : 'bg-gray-300 text-gray-500'
                }`}>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-medium ${
                    isCurrent ? (isCanceled ? 'text-red-600' : 'text-green-600') : isActive ? (isCanceled ? 'text-red-500' : 'text-green-500') : 'text-gray-400'
                  }`}>
                    {status.label}
                  </p>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default OrderProgress;
