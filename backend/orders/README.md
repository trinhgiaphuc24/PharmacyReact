"""
Hướng dẫn sử dụng API Order:

1. Đảm bảo app 'orders' đã được thêm vào INSTALLED_APPS trong settings.py:
   INSTALLED_APPS = [
       ...
       'orders',
       ...
   ]

2. Đảm bảo URLs đã được include trong main urls.py:
   from django.urls import path, include
   
   urlpatterns = [
       ...
       path('api/', include('orders.urls')),
       ...
   ]

3. Chạy migrations:
   python manage.py makemigrations orders
   python manage.py migrate

4. Test API endpoints:
   
   a) Tạo đơn hàng (POST /api/orders/create-order/):
   {
       "delivery_type": "pickup", // hoặc "delivery"
       "payment_method": "cod", // hoặc "vnpay" 
       "selected_items": [1, 2, 3], // IDs của cart items
       "shipping_info": { // chỉ cần khi delivery_type = "delivery"
           "full_name": "Nguyễn Văn A",
           "phone": "0123456789",
           "province": "Hồ Chí Minh",
           "district": "Quận 1",
           "ward": "Phường Bến Nghé",
           "address": "123 Lê Lợi",
           "note": "Ghi chú"
       }
   }
   
   b) Lấy danh sách đơn hàng (GET /api/orders/my-orders/)
   
   c) Lấy chi tiết đơn hàng (GET /api/orders/{id}/detail/)
   
   d) Hủy đơn hàng (PATCH /api/orders/{id}/cancel/)
   
   e) Lấy phí vận chuyển (GET /api/shipping-fees/)

5. Lưu ý:
   - Tất cả API đều yêu cầu authentication (Bearer token)
   - Delivery type "pickup" = nhận tại cửa hàng
   - Delivery type "delivery" = giao hàng tận nơi (cần shipping_info)
   - Payment method "cod" = thanh toán khi nhận hàng  
   - Payment method "vnpay" = thanh toán online qua VNPay
"""

# Test data mẫu cho tạo đơn hàng pickup
pickup_order_data = {
    "delivery_type": "pickup",
    "payment_method": "cod",
    "selected_items": [1, 2, 3]  # Thay bằng IDs thực tế của cart items
}

# Test data mẫu cho tạo đơn hàng delivery
delivery_order_data = {
    "delivery_type": "delivery", 
    "payment_method": "vnpay",
    "selected_items": [1, 2, 3],
    "shipping_info": {
        "full_name": "Nguyễn Văn A",
        "phone": "0123456789", 
        "province": "Hồ Chí Minh",
        "district": "Quận 1",
        "ward": "Phường Bến Nghé", 
        "address": "123 Lê Lợi",
        "note": "Gọi trước 15 phút"
    }
}
