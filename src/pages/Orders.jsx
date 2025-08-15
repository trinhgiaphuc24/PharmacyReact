import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import Spinner from "../ui/Spinner";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { orderService } from "../services/orderService";
import { 
  FaClipboardList, 
  FaArrowRight, 
  FaShoppingBag,
  FaTruck,
  FaStore,
  FaCreditCard,
  FaWallet,
  FaSearch
} from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    order_id: '',
    status: '',
    start_date: ''
  });
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();

  // Mapping status từ backend sang display
  const statusMapping = {
    'pending': { label: 'Chờ xác nhận', color: 'orange' },
    'waiting_for_pickup': { label: 'Chờ lấy hàng', color: 'blue' },
    'waiting_for_delivery': { label: 'Chờ giao hàng', color: 'purple' },
    'delivered': { label: 'Đã giao', color: 'green' },
    'returned': { label: 'Trả hàng', color: 'yellow' },
    'canceled': { label: 'Đã hủy', color: 'red' }
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

  // Load orders from backend
  const loadOrders = useCallback(async (page = 1, searchFilters = {}) => {
    if (!isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await orderService.getMyOrders(page, searchFilters);
      
      if (response.success && response.data) {
        setOrders(response.data);
        // Handle pagination if exists
        if (response.pagination) {
          setTotalPages(response.pagination.total_pages || 1);
        } else if (response.next || response.previous) {
          // DRF pagination format
          setTotalPages(Math.ceil(response.count / 10));
        }
      } else if (Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      showError('Không thể tải danh sách đơn hàng');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, showError]);

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }

    try {
      const response = await orderService.cancelOrder(orderId);
      if (response.success) {
        showSuccess('Đã hủy đơn hàng thành công');
        loadOrders(currentPage); // Reload orders
      } else {
        showError(response.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      showError('Có lỗi xảy ra khi hủy đơn hàng');
    }
  };

  // Load orders on component mount
  useEffect(() => {
    loadOrders(currentPage, filters);
  }, [currentPage, filters, loadOrders]);

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    loadOrders(1, newFilters);
  };

  // Get status styling
  const getStatusStyling = (status) => {
    const statusInfo = statusMapping[status] || { label: status, color: 'gray' };
    const colorClasses = {
      'orange': 'bg-orange-100 text-orange-800 border-orange-200',
      'blue': 'bg-blue-100 text-blue-800 border-blue-200',
      'purple': 'bg-purple-100 text-purple-800 border-purple-200',
      'green': 'bg-green-100 text-green-800 border-green-200',
      'yellow': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'red': 'bg-red-100 text-red-800 border-red-200',
      'gray': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return {
      label: statusInfo.label,
      className: colorClasses[statusInfo.color] || colorClasses.gray
    };
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN');
    } catch {
      return dateString;
    }
  };

  if (!isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Header />
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-4">Vui lòng đăng nhập</h2>
          <p className="text-gray-500 mb-6">Bạn cần đăng nhập để xem danh sách đơn hàng</p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
          >
            Đăng nhập ngay
            <FaArrowRight />
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
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <FaClipboardList className="text-green-700 text-2xl" />
            <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search by Order ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm mã đơn hàng</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Nhập mã đơn hàng..."
                    value={filters.order_id}
                    onChange={(e) => handleFilterChange('order_id', e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Tất cả trạng thái</option>
                  <option value="pending">Chờ xác nhận</option>
                  <option value="waiting_for_pickup">Chờ lấy hàng</option>
                  <option value="waiting_for_delivery">Chờ giao hàng</option>
                  <option value="delivered">Đã giao</option>
                  <option value="returned">Trả hàng</option>
                  <option value="canceled">Đã hủy</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày đặt hàng</label>
                <input
                  type="date"
                  value={filters.start_date}
                  onChange={(e) => handleFilterChange('start_date', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* ...đã xóa nút xóa bộ lọc... */}
          </div>

          {/* Loading state */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusStyle = getStatusStyling(order.status);
                const paymentInfo = paymentMapping[order.paymentMethod] || { label: order.paymentMethod, icon: FaCreditCard };
                const shippingInfo = shippingMapping[order.online_order?.shipping_method] || { label: 'Không xác định', icon: FaStore };
                const PaymentIcon = paymentInfo.icon;
                const ShippingIcon = shippingInfo.icon;
                
                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                        {/* Thông tin đơn hàng */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-800">
                              Đơn hàng #{order.id}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusStyle.className}`}>
                              {statusStyle.label}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                            <div>
                              <span className="font-medium text-gray-700">Ngày đặt:</span>
                              <div>{formatDate(order.date)}</div>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Tổng tiền:</span>
                              <div className="text-green-700 font-semibold text-lg">
                                {order.total.toLocaleString()} đ
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

                          {/* ...đã xóa phần hiển thị địa chỉ giao hàng... */}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2 min-w-[140px]">
                          <Link
                            to={`/order-detail/${order.id}`}
                            className="inline-flex items-center justify-center gap-2 bg-green-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-800 transition-colors text-sm"
                          >                          
                            Xem chi tiết
                          </Link>
                          
                          {order.status === 'pending' && (
                            <button 
                              onClick={() => handleCancelOrder(order.id)}
                              className="inline-flex items-center justify-center gap-2 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors border border-red-700 text-sm"
                            >
                              Hủy đơn
                            </button>
                          )}
                          
                          {order.status === 'delivered' && (
                            <button className="inline-flex items-center justify-center gap-2 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors border border-green-700 text-sm">
                              <FaShoppingBag className="w-4 h-4" />
                              Mua lại
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Pagination if needed */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          currentPage === i + 1
                            ? 'bg-green-700 text-white'
                            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-16">
              <FaClipboardList className="mx-auto text-6xl text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-4">Chưa có đơn hàng nào</h2>
              <p className="text-gray-500 mb-8">
                Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!
              </p>
              
              <Link 
                to="/medicines" 
                className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Bắt đầu mua sắm
                <FaArrowRight />
              </Link>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default Orders;
