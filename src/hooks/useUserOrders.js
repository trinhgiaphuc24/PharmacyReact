import { useState, useEffect, useCallback } from 'react';
import orderService from '../services/orderService';

export const useUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchOrders = useCallback(async (page = 1, overrideFilters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const currentStatusFilter = overrideFilters.status !== undefined ? overrideFilters.status : statusFilter;
      const currentSearchQuery = overrideFilters.search !== undefined ? overrideFilters.search : debouncedSearchQuery;
      const currentDateFilter = overrideFilters.date !== undefined ? overrideFilters.date : dateFilter;
      
      const apiFilters = {};
      if (currentStatusFilter !== "all") {
        apiFilters.status = currentStatusFilter;
      }
      if (currentSearchQuery?.trim()) {
        apiFilters.order_id = currentSearchQuery.trim();
      }
      if (currentDateFilter?.trim()) {
        apiFilters.start_date = currentDateFilter.trim();
      }
      
      const response = await orderService.getMyOrders(page, apiFilters);
      
      let ordersData = [];
      let totalCount = 0;
      let pageSize = 10;
      
      // Handle different response structures
      if (response?.success && response.data) {
        if (response.data.results && Array.isArray(response.data.results)) {
          ordersData = response.data.results;
          totalCount = response.data.count || ordersData.length;
          pageSize = response.data.page_size || 10;
        } else if (Array.isArray(response.data)) {
          ordersData = response.data;
          totalCount = ordersData.length;
        }
      } else if (response?.results?.success && Array.isArray(response.results.data)) {
        ordersData = response.results.data;
        totalCount = response.count || ordersData.length;
        pageSize = response.page_size || 10;
      } else if (response?.results && Array.isArray(response.results)) {
        ordersData = response.results;
        totalCount = response.count || ordersData.length;
        pageSize = response.page_size || 10;
      } else if (Array.isArray(response)) {
        ordersData = response;
        totalCount = ordersData.length;
      } else {
        throw new Error('Cấu trúc dữ liệu không đúng từ server');
      }

      const formattedOrders = ordersData.map(order => ({
        id: order.id,
        customerName: order.user_name || 'N/A',
        totalAmount: parseFloat(order.total || 0),
        status: order.status || 'pending',
        createdAt: order.createdAt,
        date: order.date,
        details: order.details || [],
        paymentMethod: order.paymentMethod || 'cod',
        online_order: order.online_order || {}
      }));
      
      setOrders(formattedOrders);
      setCurrentPage(page);
      setTotalPages(Math.ceil(totalCount / pageSize));
      
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, debouncedSearchQuery, dateFilter]);

  const cancelOrder = async (orderId) => {
    const response = await orderService.cancelOrder(orderId);
    if (response.success) {
      fetchOrders(currentPage);
      return true;
    }
    throw new Error(response.message || 'Không thể hủy đơn hàng');
  };

  return {
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
  };
};
