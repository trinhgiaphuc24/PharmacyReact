import api, { endpoints } from "../utils/axiosConfig";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

export const orderService = {
    createOrder: async (orderData) => {
        const response = await api.post(endpoints['create-order'], orderData, { headers: getAuthHeaders() });
        return response.data;
    },

    getMyOrders: async (page = 1, filters = {}) => {
        const params = new URLSearchParams({ page });
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
        
        const response = await api.get(`${endpoints.orders}my-orders/?${params.toString()}`, { 
            headers: getAuthHeaders() 
        });
        return response.data;
    },

    getOrderDetail: async (orderId) => {
        const response = await api.get(`${endpoints.orders}${orderId}/`, { headers: getAuthHeaders() });
        return response.data;
    },

    getStaffOrderDetail: async (orderId) => {
        const response = await api.get(`${endpoints['staff-all-orders']}?order_id=${orderId}`, { 
            headers: getAuthHeaders() 
        });
        
        // Extract order data from various response structures
        let ordersData = [];
        const data = response.data;
        
        if (data?.results?.success && data.results.data) {
            ordersData = Array.isArray(data.results.data) ? data.results.data : [data.results.data];
        } else if (data?.success && data.data) {
            ordersData = Array.isArray(data.data) ? data.data : [data.data];
        } else if (data?.results) {
            ordersData = Array.isArray(data.results) ? data.results : [data.results];
        } else if (Array.isArray(data)) {
            ordersData = data;
        }
        
        if (ordersData.length > 0) {
            return { success: true, data: ordersData[0] };
        }
        throw new Error('Order not found');
    },

    cancelOrder: async (orderId) => {
        const response = await api.patch(`${endpoints.orders}${orderId}/cancel/`, {}, { headers: getAuthHeaders() });
        return response.data;
    },

    getShippingFees: async () => {
        const response = await api.get(endpoints['shipping-fees'], { headers: getAuthHeaders() });
        return response.data;
    },

    createVNPayPayment: async (orderId) => {
        const response = await api.post(endpoints['vnpay-create-payment'], { order_id: orderId }, { 
            headers: getAuthHeaders() 
        });
        return response.data;
    },

    checkPaymentStatus: async (orderId) => {
        const response = await api.get(`${endpoints['vnpay-check-status']}${orderId}/`, { headers: getAuthHeaders() });
        return response.data;
    },

    sendOrderEmail: async (orderId) => {
        const response = await api.post(endpoints['order-email'], { order_id: orderId }, { 
            headers: getAuthHeaders() 
        });
        return response.data;
    },

    getAllOrders: async (page = 1, filters = {}) => {
        const params = new URLSearchParams({ page });
        
        if (filters.status && filters.status !== 'all') {
            params.append('status', filters.status);
        }
        if (filters.order_id?.trim()) {
            params.append('order_id', filters.order_id.trim());
        }
        if (filters.start_date) {
            params.append('start_date', filters.start_date);
        }
        
        const response = await api.get(`${endpoints['staff-all-orders']}?${params.toString()}`, { 
            headers: getAuthHeaders() 
        });
        return response.data;
    },

    updateOrderStatus: async (orderId, status) => {
        try {
            const response = await api.patch(`${endpoints.orders}${orderId}/update-status/`, 
                { status }, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            if (error.response?.status === 404) {
                return orderService.updateOrderStatusFallback(orderId, status);
            }
            throw error;
        }
    },

    updateOrderStatusFallback: async (orderId, status) => {
        const response = await api.patch(`${endpoints.orders}${orderId}/`, 
            { status }, { headers: getAuthHeaders() });
        return response.data;
    }
};

export default orderService;
