import { useState, useEffect } from 'react';
import orderService from '../services/orderService';

export const useOrderDetail = (orderId) => {
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shippingFees, setShippingFees] = useState([]);

  const getShippingFee = () => {
    // Đơn hàng bán trực tiếp (store_pickup) hoặc không có phí ship thì trả về 0
    if (order?.online_order?.shipping_method === 'store_pickup' || 
        order?.shipping_fee === null || 
        order?.shipping_fee === 0) {
      return 0;
    }
    return shippingFees[0]?.price;
  };

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        setIsLoading(true);
        const [orderResponse, shippingResponse] = await Promise.all([
          orderService.getStaffOrderDetail(orderId),
          orderService.getShippingFees()
        ]);
        
        if (orderResponse?.success && orderResponse.data) {
          setOrder(orderResponse.data);
          setShippingFees(Array.isArray(shippingResponse) ? shippingResponse : shippingResponse.data || []);
        } else {
          throw new Error('Invalid response');
        }
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) fetchOrderDetail();
  }, [orderId]);

  const updateOrderStatus = async (newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      setOrder(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      try {
        await orderService.updateOrderStatusFallback(orderId, newStatus);
        setOrder(prev => ({ ...prev, status: newStatus }));
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
  };

  return {
    order,
    isLoading,
    shippingFees,
    getShippingFee,
    updateOrderStatus
  };
};