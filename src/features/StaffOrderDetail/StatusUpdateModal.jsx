import React from 'react';
import { Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';

const StatusUpdateModal = ({ isOpen, onClose, orderId, currentStatus, onStatusChange }) => {
  if (!isOpen) return null;

  const statusConfig = {
    pending: { text: "Chờ xác nhận", icon: Clock },
    waiting_for_pickup: { text: "Chờ lấy hàng", icon: Package },
    waiting_for_delivery: { text: "Chờ giao hàng", icon: Truck },
    delivered: { text: "Đã giao", icon: CheckCircle },
    canceled: { text: "Đã hủy", icon: XCircle },
  };

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
            return (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
                  currentStatus === status
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <StatusIcon className="w-5 h-5" />
                <span className="font-medium">{config.text}</span>
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
