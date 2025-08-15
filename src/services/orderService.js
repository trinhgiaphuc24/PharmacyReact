import api, { endpoints } from "../utils/axiosConfig";

// Order Service
export const orderService = {
    // Tạo đơn hàng mới
    createOrder: async (orderData) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            const response = await api.post(endpoints['create-order'], orderData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Create order error:', error);
            throw error;
        }
    },

    // Lấy danh sách đơn hàng của user với filter
    getMyOrders: async (page = 1, filters = {}) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            
            // Build query parameters
            const params = new URLSearchParams();
            params.append('page', page);
            
            // Add filters to params
            if (filters.order_id) params.append('order_id', filters.order_id);
            if (filters.status) params.append('status', filters.status);
            if (filters.payment_method) params.append('payment_method', filters.payment_method);
            if (filters.shipping_method) params.append('shipping_method', filters.shipping_method);
            if (filters.start_date) params.append('start_date', filters.start_date);
            if (filters.end_date) params.append('end_date', filters.end_date);
            
            const response = await api.get(`${endpoints.orders}my-orders/?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get my orders error:', error);
            throw error;
        }
    },

    // Lấy chi tiết đơn hàng
    getOrderDetail: async (orderId) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            const response = await api.get(`${endpoints.orders}${orderId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get order detail error:', error);
            throw error;
        }
    },

    // Hủy đơn hàng
    cancelOrder: async (orderId) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            const response = await api.patch(`${endpoints.orders}${orderId}/cancel/`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Cancel order error:', error);
            throw error;
        }
    },

    // Lấy danh sách phí vận chuyển
    getShippingFees: async () => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            console.log('[orderService.getShippingFees] token:', token);
            const response = await api.get(endpoints['shipping-fees'], {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            console.log('[orderService.getShippingFees] response:', response);
            return response.data;
        } catch (error) {
            console.error('Get shipping fees error:', error);
            throw error;
        }
    },

    // Tạo URL thanh toán VNPay
    createVNPayPayment: async (orderId) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            const response = await api.post(endpoints['vnpay-create-payment'], {
                order_id: orderId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Create VNPay payment error:', error);
            throw error;
        }
    },

    // Kiểm tra trạng thái thanh toán
    checkPaymentStatus: async (orderId) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            const response = await api.get(`${endpoints['vnpay-check-status']}${orderId}/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            console.error('Check payment status error:', error);
            throw error;
        }
    },

    // Gửi email đặt hàng thành công
    sendOrderEmail: async (orderId) => {
        try {
            const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
            const response = await api.post(endpoints['order-email'], {
                order_id: orderId
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Send order email error:', error);
            throw error;
        }
    }
};

export default orderService;
