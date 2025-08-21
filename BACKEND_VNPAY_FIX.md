# BACKEND: Thêm endpoint VNPay Create Payment Direct

## VẤN ĐỀ ĐÃ GIẢI QUYẾT
- **Trước**: Tạo đơn hàng trước → VNPay → Nếu hủy thì đơn hàng vẫn tồn tại trong DB
- **Sau**: VNPay trước → Chỉ tạo đơn hàng KHI thanh toán thành công

## ENDPOINT MỚI CẦN THÊM

### 1. `/vnpay/create-payment-direct/` (POST)

```python
# backend/orders/vnpay_views.py

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_direct(request):
    """
    Tạo URL VNPay payment trực tiếp từ orderData
    KHÔNG tạo order trong database
    """
    try:
        # Lấy dữ liệu đơn hàng từ request
        order_data = request.data
        
        # Validate dữ liệu đơn hàng
        total_amount = order_data.get('total', 0)
        if not total_amount:
            return Response({
                'success': False,
                'message': 'Thiếu thông tin tổng tiền'
            }, status=400)
        
        # Tạo temporary order_id để track (không lưu DB)
        import uuid
        temp_order_id = str(uuid.uuid4())
        
        # Lưu order_data vào cache/session với temp_order_id
        # Redis hoặc Django session
        request.session[f'pending_order_{temp_order_id}'] = order_data
        
        # Tạo VNPay payment URL
        vnp_service = VNPayService()
        payment_url = vnp_service.create_payment_url(
            order_id=temp_order_id,
            amount=total_amount,
            order_desc=f"Thanh toan don hang {temp_order_id}",
            return_url=request.build_absolute_uri('/api/vnpay/return/')
        )
        
        return Response({
            'success': True,
            'payment_url': payment_url,
            'temp_order_id': temp_order_id
        })
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=500)
```

### 2. Sửa VNPay Return/Callback

```python
# backend/orders/vnpay_views.py

@csrf_exempt
def vnpay_return(request):
    """
    VNPay callback - Tạo đơn hàng SAU KHI thanh toán thành công
    """
    try:
        # Verify VNPay response
        vnp_service = VNPayService()
        if vnp_service.verify_payment_response(request.GET):
            
            # Lấy temp_order_id từ VNPay response
            temp_order_id = request.GET.get('vnp_TxnRef')
            
            # Lấy order_data từ session
            session_key = f'pending_order_{temp_order_id}'
            order_data = request.session.get(session_key)
            
            if order_data:
                # TẠO ĐƠN HÀNG THẬT SỰ SAU KHI THANH TOÁN THÀNH CÔNG
                serializer = OrderSerializer(data=order_data)
                if serializer.is_valid():
                    order = serializer.save()
                    
                    # Xóa data từ session
                    del request.session[session_key]
                    
                    # Redirect thành công
                    return redirect(f'{FRONTEND_URL}/payment/success?order_id={order.id}&payment_method=vnpay')
                else:
                    return redirect(f'{FRONTEND_URL}/payment/error?reason=create_order_failed&order_id={temp_order_id}')
            else:
                return redirect(f'{FRONTEND_URL}/payment/error?reason=order_data_not_found&order_id={temp_order_id}')
        else:
            # Thanh toán thất bại - KHÔNG tạo đơn hàng
            temp_order_id = request.GET.get('vnp_TxnRef', 'unknown')
            
            # Xóa data từ session nếu có
            session_key = f'pending_order_{temp_order_id}'
            if session_key in request.session:
                del request.session[session_key]
            
            return redirect(f'{FRONTEND_URL}/payment/error?reason=payment_failed&order_id={temp_order_id}')
            
    except Exception as e:
        return redirect(f'{FRONTEND_URL}/payment/error?reason=system_error')
```

### 3. Thêm URL pattern

```python
# backend/orders/urls.py

urlpatterns = [
    # ... existing patterns
    path('vnpay/create-payment-direct/', views.create_payment_direct, name='vnpay-create-payment-direct'),
    # ... 
]
```

## KẾT QUẢ
- ✅ **VNPay hủy**: KHÔNG tạo đơn hàng, KHÔNG lưu DB
- ✅ **VNPay thành công**: Tạo đơn hàng SAU KHI thanh toán
- ✅ **COD**: Tạo đơn hàng ngay lập tức như cũ
