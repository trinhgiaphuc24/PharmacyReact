import React from 'react';
import { FaCreditCard, FaWallet, FaStore, FaTruck, FaFilePdf } from 'react-icons/fa';

const OrderDetailSummary = ({ order, getShippingFee, isCanceling, onCancel, isExporting, onExportPDF }) => {
  const paymentMapping = {
    'cod': { label: 'Thanh toán khi nhận hàng', icon: FaCreditCard },
    'vnpay': { label: 'VNPay', icon: FaWallet }
  };

  const shippingMapping = {
    'store_pickup': { label: 'Nhận tại cửa hàng', icon: FaStore },
    'home_delivery': { label: 'Giao hàng tận nơi', icon: FaTruck }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm sticky top-4">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">Thông tin đơn hàng</h3>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Payment Method */}
        <div className="flex items-center gap-3">
          {React.createElement(paymentMapping[order.paymentMethod]?.icon || FaCreditCard, {
            className: "text-gray-600"
          })}
          <div>
            <p className="text-sm text-gray-600">Phương thức thanh toán</p>
            <p className="font-semibold">{paymentMapping[order.paymentMethod]?.label || order.paymentMethod}</p>
          </div>
        </div>

        {/* Shipping Method */}
        <div className="flex items-center gap-3">
          {React.createElement(shippingMapping[order.online_order?.shipping_method]?.icon || FaStore, {
            className: "text-gray-600"
          })}
          <div>
            <p className="text-sm text-gray-600">Hình thức nhận hàng</p>
            <p className="font-semibold">
              {shippingMapping[order.online_order?.shipping_method]?.label || order.online_order?.shipping_method}
            </p>
          </div>
        </div>

        <hr />

        {/* Price Breakdown */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{(order.total - getShippingFee()).toLocaleString()} đ</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span className={order.online_order?.shipping_method === 'home_delivery' ? "text-orange-600" : "text-green-700"}>
              {order.online_order?.shipping_method === 'home_delivery' 
                ? `${getShippingFee().toLocaleString()} đ`
                : 'Miễn phí'
              }
            </span>
          </div>
        </div>

        <hr />

        <div className="flex justify-between text-lg font-bold">
          <span>Tổng cộng</span>
          <span className="text-green-700">{order.total?.toLocaleString()} đ</span>
        </div>

        {/* Cancel Button */}
        {(order.status === 'pending' || order.status === 'waiting_for_pickup') && (
          <button
            onClick={onCancel}
            disabled={isCanceling}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              isCanceling
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            {isCanceling ? 'Đang hủy...' : 'Hủy đơn hàng'}
          </button>
        )}

        {/* Export PDF Button */}
        {order.status === 'delivered' && (
          <button
            onClick={onExportPDF}
            disabled={isExporting}
            className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
              isExporting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <FaFilePdf className="w-4 h-4" />
            {isExporting ? 'Đang xuất...' : 'Xuất hóa đơn PDF'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderDetailSummary;
