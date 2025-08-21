import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/';

export const endpoints = {
    'login': '/o/token/',
    'current-user': '/users/current-user/',
    'register': '/users/',
    'medicines': '/medicines',
    'medicine-genres': '/medicine-genres',
    'produces': '/produces',
    'chatbot': '/chatbot/',
    'cart': '/carts/',
    'my-cart': '/carts/my-cart/',
    'cart-items': '/cart-items/',
    'add-to-cart': '/cart-items/add-to-cart/',
    'update-cart-quantity': '/cart-items/{itemId}/update-quantity/',
    'orders': '/orders/',
    'order-detail': '/orders/{orderId}/',
    'create-order': '/orders/create-order/',
    'my-orders': '/orders/my-orders/',
    'staff-all-orders': '/orders/staff-all-orders/',  // Endpoint riêng cho staff xem tất cả đơn hàng
    'shipping-fees': '/shipping-fees/',
    'vnpay-create-payment': '/vnpay/create-payment/',
    'vnpay-check-status': '/vnpay/check-status/',
    'order-email': '/order-email/',
};

export default axios.create({
    baseURL: BASE_URL
});

export const createAuthenticatedAxios = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('userToken');
    return axios.create({
        baseURL: BASE_URL,
        headers: token ? {
            'Authorization': `Bearer ${token}`
        } : {}
    });
};