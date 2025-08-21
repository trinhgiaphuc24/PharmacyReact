import React from "react";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";

const OrderStatusBadge = ({ status, showIcon = false, className = "" }) => {
  const statusConfig = {
    pending: { bg: "bg-yellow-100 text-yellow-800 border-yellow-200", text: "Chờ xác nhận", icon: Clock },
    waiting_for_pickup: { bg: "bg-blue-100 text-blue-800 border-blue-200", text: "Chờ lấy hàng", icon: Package },
    shipping: { bg: "bg-orange-100 text-orange-800 border-orange-200", text: "Đang giao hàng", icon: Truck },
    delivered: { bg: "bg-green-100 text-green-800 border-green-200", text: "Đã giao", icon: CheckCircle },
    returned: { bg: "bg-purple-100 text-purple-800 border-purple-200", text: "Trả hàng", icon: XCircle },
    canceled: { bg: "bg-red-100 text-red-800 border-red-200", text: "Đã hủy", icon: XCircle },
  };

  const statusInfo = statusConfig[status] || { bg: "bg-gray-100 text-gray-800 border-gray-200", text: status, icon: Package };
  const StatusIcon = statusInfo.icon;

  if (showIcon) {
    return (
      <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-lg border ${statusInfo.bg} ${className}`}>
        <StatusIcon className="w-5 h-5" />
        <span className="font-semibold text-lg">{statusInfo.text}</span>
      </div>
    );
  }

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.bg} ${className}`}>
      {statusInfo.text}
    </span>
  );
};

export default OrderStatusBadge;
