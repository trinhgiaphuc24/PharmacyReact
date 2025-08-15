# BACKEND: Hỗ trợ Buy Now trong Create Order API

## VẤN ĐỀ HIỆN TẠI
- Frontend gửi `is_buy_now: true` + `buy_now_medicine_id` + `buy_now_quantity`
- Backend cần xử lý trường hợp này trong `/orders/create-order/`

## BACKEND CẦN SỬA

### 1. Cập nhật OrderSerializer hoặc CreateOrder View

```python
# backend/orders/views.py hoặc serializers.py

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_order(request):
    try:
        data = request.data
        
        # Check if this is a buy now order
        if data.get('is_buy_now'):
            # Handle buy now order
            medicine_id = data.get('buy_now_medicine_id')
            quantity = data.get('buy_now_quantity', 1)
            
            if not medicine_id:
                return Response({
                    'success': False,
                    'message': 'Medicine ID is required for buy now'
                }, status=400)
            
            try:
                medicine = Medicine.objects.get(id=medicine_id)
            except Medicine.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Medicine not found'
                }, status=404)
            
            # Create order with buy now item
            order = Order.objects.create(
                user=request.user,
                delivery_type=data.get('delivery_type', 'pickup'),
                payment_method=data.get('payment_method', 'cod'),
                status='pending',
                # Add shipping info if delivery
                **({
                    'shipping_name': data['shipping_info']['full_name'],
                    'shipping_phone': data['shipping_info']['phone'],
                    'shipping_address': f"{data['shipping_info']['address']}, {data['shipping_info']['ward']}, {data['shipping_info']['district']}, {data['shipping_info']['province']}",
                } if data.get('delivery_type') == 'delivery' and data.get('shipping_info') else {})
            )
            
            # Create order item
            OrderDetail.objects.create(
                order=order,
                medicine=medicine,
                quantity=quantity,
                unit_price=medicine.price
            )
            
            # Create payment detail
            shipping_fee = 0
            if data.get('delivery_type') == 'delivery':
                default_shipping = ShippingFee.objects.filter(is_default=True).first()
                shipping_fee = default_shipping.price if default_shipping else 30000
            
            total_amount = medicine.price * quantity + shipping_fee
            
            PaymentDetail.objects.create(
                order=order,
                total_amount=total_amount,
                shipping_fee_id=default_shipping.id if default_shipping else None
            )
            
            return Response({
                'success': True,
                'message': 'Order created successfully',
                'data': {
                    'id': order.id,
                    'total': total_amount
                }
            })
        
        else:
            # Handle normal cart order (existing logic)
            selected_items = data.get('selected_items', [])
            if not selected_items:
                return Response({
                    'success': False,
                    'message': 'No items selected'
                }, status=400)
            
            # ... existing cart order logic ...
            
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=500)
```

### 2. Hoặc tạo endpoint riêng cho Buy Now

```python
# backend/orders/views.py

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_buy_now_order(request):
    """
    Tạo đơn hàng mua ngay với 1 sản phẩm
    """
    try:
        data = request.data
        medicine_id = data.get('medicine_id')
        quantity = data.get('quantity', 1)
        
        if not medicine_id:
            return Response({'success': False, 'message': 'Medicine ID required'}, status=400)
        
        medicine = Medicine.objects.get(id=medicine_id)
        
        # Tạo đơn hàng...
        # Logic tương tự như trên
        
    except Medicine.DoesNotExist:
        return Response({'success': False, 'message': 'Medicine not found'}, status=404)
    except Exception as e:
        return Response({'success': False, 'message': str(e)}, status=500)

# backend/orders/urls.py
urlpatterns = [
    # ... existing patterns
    path('create-buy-now-order/', views.create_buy_now_order, name='create-buy-now-order'),
]
```

## FRONTEND ALTERNATIVE (Nếu không muốn sửa backend)

Có thể thêm item vào cart trước, rồi checkout như bình thường:

```javascript
// Trong handlePlaceOrder của Checkout.jsx
if (isBuyNow && buyNowItem) {
  // Add to cart first
  const medicine = {
    id: buyNowItem.id,
    name: buyNowItem.name,
    price: buyNowItem.price
  };
  
  await addToCart(medicine, buyNowItem.quantity);
  // Sau đó proceed với checkout như bình thường
}
```

## KHUYẾN NGHỊ
Sửa backend để hỗ trợ `is_buy_now` sẽ clean hơn và không ảnh hưởng đến cart của user.
