import React, { useEffect } from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import OrderFilters from "../features/StaffOrder/OrderFilters";
import OrderTable from "../features/StaffOrder/OrderTable";
import Pagination from "../ui/Pagination";
import { useNavigate } from "react-router-dom";
import { useOrders, useOrderFilters } from "../hooks/useOrders";
import { formatCurrency, formatDate } from "../utils/helper";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const { orders, loading, error, currentPage, totalPages, fetchOrders } = useOrders();

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    buildFilters,
  } = useOrderFilters();

  useEffect(() => {
    const timer = setTimeout(() => {
      const filters = buildFilters();
      fetchOrders(1, filters);
    }, 100);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, dateFilter, buildFilters, fetchOrders]);

  const handlePageChange = (page) => {
    const filters = buildFilters();
    fetchOrders(page, filters);
  };

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
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
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
            const filters = buildFilters();
            fetchOrders(1, filters);
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
