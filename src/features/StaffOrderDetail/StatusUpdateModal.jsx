import React from 'react';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const StatusUpdateModal = ({ isOpen, onClose, orderId, currentStatus, onStatusChange }) => {
  if (!isOpen) return null;

  const statusConfig = {
    pending: { text: "Chờ xác nhận", icon: Clock, order: 1 },
    waiting_for_pickup: { text: "Chờ lấy hàng", icon: Package, order: 2 },
    waiting_for_delivery: { text: "Chờ giao hàng", icon: Truck, order: 3 },
    delivered: { text: "Đã giao", icon: CheckCircle, order: 4 },
    canceled: { text: "Đã hủy", icon: XCircle, order: 5 },
  };

  const getAllowedStatuses = (current) => {
    const currentOrder = statusConfig[current]?.order || 0;
    
    switch (current) {
      case 'pending':
        return ['waiting_for_pickup', 'canceled'];
      case 'waiting_for_pickup':
        return ['waiting_for_delivery', 'canceled'];
      case 'waiting_for_delivery':
        return ['delivered', 'canceled'];
      case 'delivered':
        return [];
      case 'canceled':
        return [];
      default:
        return Object.keys(statusConfig);
    }
  };

  const allowedStatuses = getAllowedStatuses(currentStatus);

  const handleStatusChange = (newStatus) => {
    onStatusChange(newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Cập nhật trạng thái đơn hàng</h3>
        <p className="text-gray-600 mb-6">Đơn hàng: #{orderId}</p>
        
        <div className="space-y-3">
          {Object.entries(statusConfig).map(([status, config]) => {
            const StatusIcon = config.icon;
            const isAllowed = allowedStatuses.includes(status);
            const isCurrent = currentStatus === status;
            
            return (
              <button
                key={status}
                onClick={() => isAllowed && !isCurrent ? handleStatusChange(status) : null}
                disabled={!isAllowed}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                  isCurrent
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : isAllowed
                    ? 'border-gray-200 hover:bg-gray-50 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                <StatusIcon className="w-5 h-5" />
                <div className="flex-1">
                  <span className="font-medium">{config.text}</span>
                </div>
              </button>
            );
          })}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
