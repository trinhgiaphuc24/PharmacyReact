import { useState, useCallback } from "react";
import orderService from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await orderService.getAllOrders(page, filters);
      
      let ordersData = [];
      let totalCount = 0;
      
      if (response?.results?.success && response.results.data) {
        ordersData = response.results.data;
        totalCount = response.count || ordersData.length;
      }
      
      const formattedOrders = ordersData.map(order => ({
        id: order.id,
        customerName: order.user_name || order.online_order?.ship_info?.full_name || 'N/A',
        customerPhone: order.online_order?.ship_info?.phoneNumber || 'N/A', 
        totalAmount: parseFloat(order.total || 0),
        status: order.status || 'pending',
        createdAt: order.createdAt,
        deliveryType: order.online_order?.shipping_method === 'store_pickup' ? 'pickup' : 'delivery'
      }));
      
      setOrders(formattedOrders);
      setCurrentPage(page);
      setTotalPages(Math.ceil(totalCount / 10));
      
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    error,
    currentPage,
    totalPages,
    fetchOrders,
    setCurrentPage,
    setTotalPages
  };
};

export const useOrderFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const buildFilters = useCallback(() => {
    const filters = {};
    if (statusFilter !== "all") filters.status = statusFilter;
    if (searchQuery.trim()) filters.order_id = searchQuery.trim();
    if (dateFilter) filters.start_date = dateFilter;
    return filters;
  }, [searchQuery, statusFilter, dateFilter]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    buildFilters
  };
};
