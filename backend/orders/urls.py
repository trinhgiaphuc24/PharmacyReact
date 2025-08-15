from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, ShippingFeeViewSet

router = DefaultRouter()
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'shipping-fees', ShippingFeeViewSet, basename='shipping-fee')

urlpatterns = [
    path('', include(router.urls)),
]
