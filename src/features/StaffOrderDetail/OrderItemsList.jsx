import React from 'react';
import { Package, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/helper';

const OrderItemsList = ({ items = [], getShippingFee, orderTotal }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Danh sách sản phẩm</h2>
        <div className="text-center py-8 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
          <p>Không có sản phẩm nào trong đơn hàng</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Danh sách sản phẩm</h2>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
            <img
              src={item.medicine_image || '/api/placeholder/80/80'}
              alt={item.medicine_name}
              className="w-16 h-16 object-cover rounded-lg border"
              onError={(e) => e.target.src = '/api/placeholder/80/80'}
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-lg">{item.medicine_name}</h3>
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">SL: {item.quantity}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="text-green-600 font-medium">{formatCurrency(item.price)}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-800">{formatCurrency(item.quantity * item.price)}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Total Summary */}
      <div className="border-t mt-6 pt-6">
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Tạm tính:</span>
            <span>{formatCurrency((orderTotal || 0) - getShippingFee())}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Phí vận chuyển:</span>
            <span className={getShippingFee() > 0 ? "text-orange-600" : "text-green-700"}>
              {getShippingFee() > 0 ? `${getShippingFee().toLocaleString()} đ` : 'Miễn phí'}
            </span>
          </div>
          <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-3">
            <span>Tổng cộng:</span>
            <span className="text-green-600">{formatCurrency(orderTotal || 0)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemsList;
