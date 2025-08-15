import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import Spinner from "../ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { orderService } from "../services/orderService";
import { 
  FaArrowLeft,
  FaTruck,
  FaStore,
  FaCreditCard,
  FaWallet,
  FaUser,
  FaMapMarkerAlt,
  FaPhone
} from "react-icons/fa";

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [shippingFees, setShippingFees] = useState([]);
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();

  // Mapping status từ backend sang display với progress order
  const getOrderStatuses = (shippingMethod) => {
    if (shippingMethod === 'store_pickup') {
      // Nhận tại cửa hàng - có 3 trạng thái + Đã hủy
      return [
        { key: 'pending', label: 'Chờ xác nhận' },
        { key: 'waiting_for_pickup', label: 'Chờ lấy hàng' },
        { key: 'delivered', label: 'Đã giao' },
        { key: 'canceled', label: 'Đã hủy' },
      ];
    } else {
      // Giao hàng tận nơi - có đầy đủ trạng thái + Đã hủy
      return [
        { key: 'pending', label: 'Chờ xác nhận' },
        { key: 'waiting_for_pickup', label: 'Chờ lấy hàng' },
        { key: 'waiting_for_delivery', label: 'Chờ giao hàng' },
        { key: 'delivered', label: 'Đã giao' },
        { key: 'canceled', label: 'Đã hủy' },
      ];
    }
  };

//   const statusMapping = {
//     'pending': { label: 'Chờ xác nhận', color: 'orange' },
//     'waiting_for_pickup': { label: 'Chờ lấy hàng', color: 'blue' },
//     'waiting_for_delivery': { label: 'Chờ giao hàng', color: 'purple' },
//     'delivered': { label: 'Đã giao', color: 'green' },
//     'returned': { label: 'Trả hàng', color: 'yellow' },
//     'canceled': { label: 'Đã hủy', color: 'red' }
//   };

  const getStatusIndex = (status, shippingMethod) => {
    if (status === 'canceled' || status === 'returned') return -1;
  const statuses = getOrderStatuses(shippingMethod);
  return statuses.findIndex(s => s.key === status);
  };

  // Mapping payment method
  const paymentMapping = {
    'cod': { label: 'Thanh toán khi nhận hàng', icon: FaCreditCard },
    'vnpay': { label: 'VNPay', icon: FaWallet }
  };

  // Mapping shipping method
  const shippingMapping = {
    'store_pickup': { label: 'Nhận tại cửa hàng', icon: FaStore },
    'home_delivery': { label: 'Giao hàng tận nơi', icon: FaTruck }
  };

  // Get shipping fee from API or default
  const getShippingFee = () => {
    if (order?.online_order?.shipping_method === 'store_pickup') {
      return 0;
    }
    // Use first shipping fee from API
    return shippingFees[0]?.price || 0;
  };

  // Load order detail
  useEffect(() => {
    const loadOrderDetail = async () => {
      if (!isAuthenticated()) {
        navigate('/login');
        return;
      }

      try {
        setIsLoading(true);
        console.log('Loading order detail for ID:', orderId); // Debug log
        
        // Fetch order details and shipping fees in parallel
        const [orderResponse, shippingResponse] = await Promise.all([
          orderService.getOrderDetail(orderId),
          orderService.getShippingFees()
        ]);
        
        console.log('Order detail response:', orderResponse); // Debug log
        console.log('Shipping fees response:', shippingResponse); // Debug log
        
        if (orderResponse.success) {
          setOrder(orderResponse.data);
          // shippingResponse is direct array, not object with data property
          setShippingFees(Array.isArray(shippingResponse) ? shippingResponse : shippingResponse.data || []);
        } else {
          throw new Error(orderResponse.message || 'Không thể tải chi tiết đơn hàng');
        }
      } catch (error) {
        console.error('Error loading order detail:', error);
        showError(error.message || 'Có lỗi xảy ra khi tải chi tiết đơn hàng');
        navigate('/orders');
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId, isAuthenticated, navigate, showError]);

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      setIsCanceling(true);
      const response = await orderService.cancelOrder(orderId);
      
      if (response.success) {
        setOrder(prev => ({ ...prev, status: 'canceled' }));
        showSuccess('Đơn hàng đã được hủy thành công');
      } else {
        throw new Error(response.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      showError(error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setIsCanceling(false);
    }
  };

//   const getStatusLabel = (status) => {
//     const mapping = statusMapping[status];
//     return mapping ? mapping.label : status;
//   };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-16">
          <Spinner />
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Không tìm thấy đơn hàng</h2>
          <Link to="/orders" className="text-green-700 hover:underline">
            Quay lại danh sách đơn hàng
          </Link>
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <Link to="/orders" className="flex items-center gap-1 hover:text-green-700">
              <FaArrowLeft className="text-xs" />
              Đơn hàng của tôi
            </Link>
            <span>/</span>
            <span className="text-green-700 font-medium">Chi tiết đơn hàng #{order.id}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Đơn hàng #{order.id}</h2>
                </div>

                {/* Progress Bar cho Order Status */}
                {(() => {
                  const shippingMethod = order.online_order?.shipping_method;
                  const currentStatuses = getOrderStatuses(shippingMethod);
                  const currentIndex = getStatusIndex(order.status, shippingMethod);
                  // Luôn show progress bar với trạng thái "Đã hủy" cuối cùng cho cả hai loại đơn hàng
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
                          }}></div>
                        {currentStatuses.map((status, index) => {
                          const isCanceled = status.key === 'canceled';
                          // Nếu trạng thái là canceled, chỉ bước cuối cùng sáng màu đỏ, các bước trước đều xám
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
                            // Logic cũ cho các trạng thái khác
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
                })()}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt hàng</p>
                    <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tổng tiền</p>
                    <p className="font-semibold text-green-700">{order.total?.toLocaleString()} đ</p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Sản phẩm đã đặt</h3>
                
                <div className="space-y-4">
                  {order.details?.map((item, index) => (
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

              {/* Shipping Info */}
              {order.online_order?.shipping_method === 'home_delivery' && order.online_order?.ship_info && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="text-green-700" />
                    <h3 className="text-lg font-semibold text-gray-800">Thông tin giao hàng</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FaUser className="text-gray-500" />
                      <span>{order.online_order.ship_info.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-gray-500" />
                      <span>{order.online_order.ship_info.phoneNumber}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaMapMarkerAlt className="text-gray-500 mt-1" />
                      <div>
                        <p>{order.online_order.ship_info.specific}</p>
                        <p className="text-gray-600">
                          {order.online_order.ship_info.commune}, {order.online_order.ship_info.district}, {order.online_order.ship_info.province}
                        </p>
                        {order.online_order.ship_info.note && (
                          <p className="text-gray-600 italic">Ghi chú: {order.online_order.ship_info.note}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
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
                  {order.status === 'pending' && (
                    <button
                      onClick={handleCancelOrder}
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default OrderDetail;
