import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from 'react-router-dom';
import orderService from '../services/orderService';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  // Get values from URL params - giống useUserOrders
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("search") || "";
  const statusFilter = searchParams.get("status") || "all";
  const dateFilter = searchParams.get("date") || "";

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    const filters = {};
    if (statusFilter !== "all") filters.status = statusFilter;
    if (searchQuery.trim()) filters.order_id = searchQuery.trim();
    if (dateFilter) filters.start_date = dateFilter;
    
    try {
      const response = await orderService.getAllOrders(currentPage, filters);
      
      let ordersData = [];
      let totalCount = 0;
      
      if (response?.results?.success && response.results.data) {
        ordersData = response.results.data;
        totalCount = response.count || ordersData.length;
      }
      
      const formattedOrders = ordersData.map(order => ({
        id: order.id,
        customerName: order.user_name || order.online_order?.ship_info?.full_name,
        customerPhone: order.online_order?.ship_info?.phoneNumber, 
        totalAmount: parseFloat(order.total),
        status: order.status,
        createdAt: order.createdAt,
        deliveryType: order.online_order?.shipping_method === 'store_pickup' ? 'pickup' : 'delivery'
      }));
      
      setOrders(formattedOrders);
      setTotalPages(Math.ceil(totalCount / 10));
      
    } catch (error) {
      console.error('Fetch orders error:', error);
      setError('Không thể tải danh sách đơn hàng.');
      setOrders([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, statusFilter, dateFilter]);

  // Giống useUserOrders - gọi load function khi dependencies thay đổi
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Giống useUserOrders - update params functions
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
    fetchOrders: loadOrders, // Giữ nguyên loadOrders cho retry
    handlePageChange, // Riêng cho pagination
  };
};

// Không cần useOrderFilters nữa vì đã tích hợp vào useOrders
