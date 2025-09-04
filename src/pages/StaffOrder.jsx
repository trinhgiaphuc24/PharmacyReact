import React from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import OrderFilters from "../features/StaffOrder/OrderFilters";
import OrderTable from "../features/StaffOrder/OrderTable";
import Pagination from "../ui/Pagination";
import { useNavigate } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { formatCurrency, formatDate } from "../utils/helper";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const { 
    orders, 
    loading, 
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
    handlePageChange
  } = useOrders();

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "waiting_for_pickup":
        return "bg-blue-100 text-blue-800";
      case "waiting_for_delivery":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "waiting_for_pickup":
        return "Chờ lấy hàng";
      case "waiting_for_delivery":
        return "Chờ giao hàng";
      case "delivered":
        return "Đã giao";
      case "canceled":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header searchQuery="" setSearchQuery={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <div >
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Quản lý đơn hàng
          </h1>
        </div>

        <OrderFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
        />

        <OrderTable
          orders={orders}
          loading={loading}
          error={error}
          onViewOrder={(orderId) => navigate(`/staff/orders/${orderId}`)}
          onRetry={() => {
            fetchOrders();
          }}
          formatCurrency={formatCurrency}
          formatDate={formatDate}
          getStatusColor={getStatusColor}
          getStatusText={getStatusText}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          loading={loading}
        />
      </div>

      <Footer />
    </div>
  );
};

export default StaffDashboard;
