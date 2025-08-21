import React, { useEffect } from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import LoadingSpinner from "../ui/LoadingSpinner";
import Pagination from "../ui/Pagination";
import SearchFilters from "../ui/SearchFilters";
import EmptyState from "../ui/EmptyState";
import UnauthenticatedView from "../ui/UnauthenticatedView";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useUserOrders } from "../hooks/useUserOrders";
import { FaClipboardList } from "react-icons/fa";
import { XCircle } from "lucide-react";
import OrderList from "../features/Order/OrderList";

const Orders = () => {
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();
  
  const {
    orders,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    fetchOrders,
    cancelOrder
  } = useUserOrders();

  const statusOptions = [
    { value: "pending", label: "Chờ xác nhận" },
    { value: "waiting_for_pickup", label: "Chờ lấy hàng" },
    { value: "shipping", label: "Đang giao hàng" },
    { value: "delivered", label: "Đã giao" },
    { value: "canceled", label: "Đã hủy" }
  ];

  useEffect(() => {
    if (isAuthenticated()) {
      fetchOrders(1);
    }
  }, [fetchOrders, isAuthenticated]);

  // Reset to page 1 when filters change
  useEffect(() => {
    if (isAuthenticated()) {
      fetchOrders(1);
    }
  }, [statusFilter, searchQuery, dateFilter, fetchOrders, isAuthenticated]);

  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      showSuccess('Đã hủy đơn hàng thành công');
    } catch (error) {
      showError(error.message || 'Có lỗi xảy ra khi hủy đơn hàng');
    }
  };

  if (!isAuthenticated()) {
    return (
      <UnauthenticatedView 
        icon={FaClipboardList}
        title="Vui lòng đăng nhập"
        message="Bạn cần đăng nhập để xem danh sách đơn hàng"
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <FaClipboardList className="text-green-700 text-2xl" />
            <h1 className="text-3xl font-bold text-gray-800">Đơn hàng của tôi</h1>
          </div>

          <SearchFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            searchPlaceholder="Tìm theo mã đơn hàng..."
            statusOptions={statusOptions}
          />

          {/* Content */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm border p-12">
              <div className="text-center">
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button 
                  onClick={() => fetchOrders(1)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Thử lại
                </button>
              </div>
            </div>
          ) : orders.length > 0 ? (
            <>
              <OrderList orders={orders} onCancel={handleCancelOrder} />
              <Pagination 
                currentPage={currentPage} 
                totalPages={totalPages} 
                onPageChange={fetchOrders}
                loading={isLoading}
              />
            </>
          ) : (
            <EmptyState 
              icon={FaClipboardList}
              title="Chưa có đơn hàng nào"
              description="Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm ngay!"
              actionText="Bắt đầu mua sắm"
              actionLink="/medicines"
            />
          )}
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default Orders;
