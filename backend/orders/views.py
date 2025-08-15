from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Order, ShippingFee
from .serializers import OrderSerializer, CreateOrderSerializer, ShippingFeeSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only return orders for the authenticated user
        queryset = Order.objects.filter(user=self.request.user).order_by('-createdAt')
        
        # Search by order ID
        order_id = self.request.query_params.get('order_id')
        if order_id:
            queryset = queryset.filter(id=order_id)
        
        # Filter by status
        status = self.request.query_params.get('status')
        if status:
            queryset = queryset.filter(status=status)
        
        # Filter by date (only start_date for simplicity)
        start_date = self.request.query_params.get('start_date')
        if start_date:
            queryset = queryset.filter(date=start_date)
        
        return queryset
    
    def retrieve(self, request, pk=None):
        """
        Override the default retrieve method to add custom response format
        """
        order = get_object_or_404(Order, pk=pk, user=request.user)
        serializer = self.get_serializer(order)
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=False, methods=['post'], url_path='create-order')
    def create_order(self, request):
        """
        Tạo đơn hàng mới từ giỏ hàng
        """
        serializer = CreateOrderSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            try:
                order = serializer.save()
                order_serializer = OrderSerializer(order, context={'request': request})
                return Response({
                    'success': True,
                    'message': 'Đơn hàng được tạo thành công',
                    'data': order_serializer.data
                }, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({
                    'success': False,
                    'message': f'Lỗi tạo đơn hàng: {str(e)}'
                }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({
            'success': False,
            'message': 'Dữ liệu không hợp lệ',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'], url_path='my-orders')
    def my_orders(self, request):
        """
        Lấy danh sách đơn hàng của user hiện tại
        """
        orders = self.get_queryset()
        page = self.paginate_queryset(orders)
        
        if page is not None:
            serializer = OrderSerializer(page, many=True, context={'request': request})
            return self.get_paginated_response({
                'success': True,
                'data': serializer.data
            })
        
        serializer = OrderSerializer(orders, many=True, context={'request': request})
        return Response({
            'success': True,
            'data': serializer.data
        })
    
    @action(detail=True, methods=['patch'], url_path='cancel')
    def cancel_order(self, request, pk=None):
        """
        Hủy đơn hàng (chỉ được phép hủy khi status = pending)
        """
        order = get_object_or_404(Order, pk=pk, user=request.user)
        
        if order.status != 'pending':
            return Response({
                'success': False,
                'message': 'Chỉ có thể hủy đơn hàng đang chờ xác nhận'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = 'canceled'
        order.save()
        
        serializer = OrderSerializer(order, context={'request': request})
        return Response({
            'success': True,
            'message': 'Đơn hàng đã được hủy',
            'data': serializer.data
        })


class ShippingFeeViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet chỉ đọc cho ShippingFee
    """
    queryset = ShippingFee.objects.all()
    serializer_class = ShippingFeeSerializer
    permission_classes = [IsAuthenticated]
