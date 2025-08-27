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
    },

    updateShippingInfo: async (orderId, shippingData) => {
        try {
            const response = await api.patch(`${endpoints.orders}${orderId}/update-shipping/`, 
                shippingData, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    exportOrderPDF: async (orderId) => {
        try {
            // Use backend PDF generation only
            const response = await api.get(`${endpoints.orders}${orderId}/export-pdf/`, {
                headers: getAuthHeaders(),
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `hoa-don-${orderId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            return { success: true, message: 'Đã tải xuống hóa đơn PDF' };
        } catch (error) {
            console.error('PDF export error:', error);
            return { 
                success: false, 
                message: error.response?.data?.message || 'Không thể xuất hóa đơn PDF' 
            };
        }
    },

    getStatusText: (status) => {
        const statusMap = {
            'pending': 'Chờ xác nhận',
            'waiting_for_pickup': 'Chờ lấy hàng', 
            'shipping': 'Đang giao hàng',
            'delivered': 'Đã giao',
            'canceled': 'Đã hủy'
        };
        return statusMap[status] || status;
    },

    getPaymentText: (method) => {
        const methodMap = {
            'cod': 'Thanh toán khi nhận',
            'vnpay': 'VNPay'
        };
        return methodMap[method] || method;
    },

    getShippingText: (method) => {
        const methodMap = {
            'store_pickup': 'Nhận tại cửa hàng',
            'home_delivery': 'Giao hàng tận nơi'
        };
        return methodMap[method] || 'Nhận tại cửa hàng';
    }
};

export default orderService;
