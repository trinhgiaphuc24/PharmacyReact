import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaShoppingBag,
  FaTruck,
  FaStore,
  FaCreditCard,
  FaWallet
} from 'react-icons/fa';
import OrderStatusBadge from '../StaffOrderDetail/OrderStatusBadge';
import { formatCurrency, formatDate } from '../../utils/helper';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';

const OrderCard = ({ order, onCancel }) => {
  const navigate = useNavigate();
  const { reorderItems } = useCart();
  const { showSuccess, showError } = useToast();
  
  const paymentMapping = {
    'cod': { label: 'Thanh toán khi nhận hàng', icon: FaCreditCard },
    'vnpay': { label: 'VNPay', icon: FaWallet }
  };

  const shippingMapping = {
    'store_pickup': { label: 'Nhận tại cửa hàng', icon: FaStore },
    'home_delivery': { label: 'Giao hàng tận nơi', icon: FaTruck }
  };

  const paymentInfo = paymentMapping[order.paymentMethod] || { label: order.paymentMethod, icon: FaCreditCard };
  const shippingInfo = shippingMapping[order.online_order?.shipping_method] || { label: 'Không xác định', icon: FaStore };
  const PaymentIcon = paymentInfo.icon;
  const ShippingIcon = shippingInfo.icon;

  const handleCancel = () => {
    if (window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      onCancel(order.id);
    }
  };

  const handleReorder = () => {
    try {
      if (!order.details || order.details.length === 0) {
        showError('Không có sản phẩm trong đơn hàng để mua lại');
        return;
      }

      const result = reorderItems(order.details);
      if (result.success) {
        showSuccess('Đã thêm sản phẩm vào giỏ hàng. Chuyển đến trang thanh toán...');
        setTimeout(() => {
          navigate('/checkout');
        }, 500);
      } else {
        showError(result.message || 'Có lỗi xảy ra khi mua lại');
      }
    } catch (error) {
      console.error('Reorder error:', error);
      showError('Có lỗi xảy ra khi mua lại');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
          {/* Order Information */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Đơn hàng #{order.id}
              </h3>
              <OrderStatusBadge status={order.status} />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
              <div>
                <span className="font-medium text-gray-700">Ngày đặt:</span>
                <div>{formatDate(order.date)}</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tổng tiền:</span>
                <div className="text-green-700 font-semibold text-lg">
                  {formatCurrency(order.totalAmount)}
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Số sản phẩm:</span>
                <div>{order.details?.length || 0} sản phẩm</div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Tạo lúc:</span>
                <div>{formatDate(order.createdAt)}</div>
              </div>
            </div>

            {/* Payment & Shipping info */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-lg">
                <PaymentIcon className="text-blue-600" />
                <span className="text-blue-800">{paymentInfo.label}</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-lg">
                <ShippingIcon className="text-purple-600" />
                <span className="text-purple-800">{shippingInfo.label}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 min-w-[140px]">
            <Link
              to={`/orders/${order.id}`}
              className="inline-flex items-center justify-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors text-sm"
            >                          
              Xem chi tiết
            </Link>
            
            {(order.status === 'pending' || order.status === 'waiting_for_pickup') && (
              <button 
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors border border-red-700 text-sm"
              >
                Hủy đơn
              </button>
            )}
            
            {order.status === 'delivered' && (
              <button 
                onClick={handleReorder}
                className="inline-flex items-center justify-center gap-2 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors border border-green-700 text-sm"
              >
                <FaShoppingBag className="w-4 h-4" />
                Mua lại
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
