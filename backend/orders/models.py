# File này chỉ để comment hướng dẫn
# 
# BẠN CẦN THAY ĐỔI IMPORT TRONG serializers.py VÀ views.py
# 
# Ví dụ nếu models nằm trong app 'pharmacies':
# from pharmacies.models import Order, OrderDetail, OnlineOrder, OnlineOrderShip, PaymentDetail, ShippingFee, Medicine, CartItem
#
# Hoặc nếu models nằm trong app chính:
# from main.models import Order, OrderDetail, OnlineOrder, OnlineOrderShip, PaymentDetail, ShippingFee, Medicine, CartItem
#
# Hoặc nếu models nằm cùng level:
# from myproject.models import Order, OrderDetail, OnlineOrder, OnlineOrderShip, PaymentDetail, ShippingFee, Medicine, CartItem
