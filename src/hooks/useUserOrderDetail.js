import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';

export const useUserOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCanceling, setIsCanceling] = useState(false);
  const [shippingFees, setShippingFees] = useState([]);
  
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showError, showSuccess } = useToast();

  const getShippingFee = () => {
    if (order?.online_order?.shipping_method === 'store_pickup') {
      return 0;
    }
    return shippingFees[0]?.price || 0;
  };

  const loadOrderDetail = useCallback(async () => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    try {
      setIsLoading(true);
      const [orderResponse, shippingResponse] = await Promise.all([
        orderService.getOrderDetail(orderId),
        orderService.getShippingFees()
      ]);
      
      if (orderResponse.success) {
        setOrder(orderResponse.data);
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
  }, [orderId, isAuthenticated, navigate, showError]);

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

  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId, loadOrderDetail]);

  return {
    order,
    isLoading,
    isCanceling,
    shippingFees,
    getShippingFee,
    handleCancelOrder
  };
};