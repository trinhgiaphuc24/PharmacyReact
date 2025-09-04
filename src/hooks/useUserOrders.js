import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import orderService from '../services/orderService';

export const useUserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get values from URL params - giống Medicine
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const dateFilter = searchParams.get("date") || "";

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    const apiFilters = {};
    if (statusFilter !== "all") {
      apiFilters.status = statusFilter;
    }
    if (searchQuery?.trim()) {
      apiFilters.order_id = searchQuery.trim();
    }
    if (dateFilter?.trim()) {
      apiFilters.start_date = dateFilter.trim();
    }
    
    try {
      const response = await orderService.getMyOrders(currentPage, apiFilters);
      
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
      setTotalPages(Math.ceil(totalCount / pageSize));
      
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.');
      setOrders([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, dateFilter]);

  // Giống Medicine - gọi load function khi dependencies thay đổi
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const cancelOrder = async (orderId) => {
    const response = await orderService.cancelOrder(orderId);
    if (response.success) {
      loadOrders(); // Reload orders after cancel
      return true;
    }
    throw new Error(response.message || 'Không thể hủy đơn hàng');
  };

  // Giống Medicine - update params functions
  const updateParams = (newValues, resetPage = true) => {
    const newParams = new URLSearchParams(searchParams);
    
    if (resetPage) {
      newParams.set("page", "1");
    }
    
    Object.entries(newValues).forEach(([key, value]) => {
      if (value && value !== "all") {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage }, false);
  };

  const setSearchQuery = (value) => {
    updateParams({ search: value });
  };

  const setStatusFilter = (value) => {
    updateParams({ status: value });
  };

  const setDateFilter = (value) => {
    updateParams({ date: value });
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
    fetchOrders: loadOrders, // Giữ nguyên loadOrders cho retry
    handlePageChange, // Riêng cho pagination
    cancelOrder
  };
};
