import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/orderService';

export const useCheckout = () => {
  const navigate = useNavigate();
  const { getSelectedCartItems, getSelectedAmount, syncCartWithBackend } = useCart();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();

  // Check for buy now item first, otherwise use cart items
  const getBuyNowItem = () => {
    const buyNowData = localStorage.getItem('buyNowItem');
    if (!buyNowData) return null;
    
    const parsedData = JSON.parse(buyNowData);
    // Support both single item (buy now) and array of items (reorder)
    return Array.isArray(parsedData) ? parsedData : [parsedData];
  };

  const buyNowItems = getBuyNowItem();
  const selectedItems = buyNowItems || getSelectedCartItems();
  const totalAmount = buyNowItems 
    ? buyNowItems.reduce((sum, item) => sum + (item.total_price || 0), 0)
    : getSelectedAmount();

  const [deliveryType, setDeliveryType] = useState("store_pickup");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
  });

  // Address data states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  const fetchDistricts = async (provinceCode) => {
    setLoadingDistricts(true);
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts || []);
      setWards([]);
      setShippingInfo((prev) => ({ ...prev, district: "", ward: "" }));
    } catch (error) {
      console.error("Error fetching districts:", error);
      showError("Không thể tải danh sách quận/huyện");
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchWards = async (districtCode) => {
    setLoadingWards(true);
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      const data = await response.json();
      setWards(data.wards || []);
      setShippingInfo((prev) => ({ ...prev, ward: "" }));
    } catch (error) {
      console.error("Error fetching wards:", error);
      showError("Không thể tải danh sách phường/xã");
    } finally {
      setLoadingWards(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section === "shipping") {
      setShippingInfo((prev) => ({ ...prev, [field]: value }));

      if (field === "province") {
        const selectedProvince = provinces.find(
          (p) => p.code.toString() === value
        );
        if (selectedProvince) {
          fetchDistricts(selectedProvince.code);
        }
      } else if (field === "district") {
        const selectedDistrict = districts.find(
          (d) => d.code.toString() === value
        );
        if (selectedDistrict) {
          fetchWards(selectedDistrict.code);
        }
      }
    }
  };

  const validateForm = () => {
    if (deliveryType === "home_delivery") {
      if (
        !shippingInfo.fullName ||
        !shippingInfo.phone ||
        !shippingInfo.address ||
        !shippingInfo.province ||
        !shippingInfo.district ||
        !shippingInfo.ward
      ) {
        showError("Vui lòng điền đầy đủ địa chỉ nhận hàng");
        return false;
      }
    }

    if (!paymentMethod) {
      showError("Vui lòng chọn phương thức thanh toán");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      let orderData;

      if (buyNowItems && buyNowItems.length > 0) {
        // For buy now items, create order directly without adding to cart
        orderData = {
          delivery_type: deliveryType,
          payment_method: paymentMethod,
          buy_now_items: buyNowItems.map(item => ({
            medicine_id: item.id.toString(),
            quantity: item.quantity.toString()
          })),
          shipping_info:
            deliveryType === "home_delivery"
              ? {
                  full_name: shippingInfo.fullName,
                  phone: shippingInfo.phone,
                  province:
                    provinces.find(
                      (p) => p.code.toString() === shippingInfo.province
                    )?.name || shippingInfo.province,
                  district:
                    districts.find(
                      (d) => d.code.toString() === shippingInfo.district
                    )?.name || shippingInfo.district,
                  ward:
                    wards.find((w) => w.code.toString() === shippingInfo.ward)
                      ?.name || shippingInfo.ward,
                  address: shippingInfo.address,
                  note: shippingInfo.note,
                }
              : null,
        };
      } else {
        orderData = {
          delivery_type: deliveryType,
          payment_method: paymentMethod,
          selected_items: selectedItems
            .map((item) => item.cartItemId || item.id || item.cart_item_id)
            .filter((id) => id !== undefined),
          shipping_info:
            deliveryType === "home_delivery"
              ? {
                  full_name: shippingInfo.fullName,
                  phone: shippingInfo.phone,
                  province:
                    provinces.find(
                      (p) => p.code.toString() === shippingInfo.province
                    )?.name || shippingInfo.province,
                  district:
                    districts.find(
                      (d) => d.code.toString() === shippingInfo.district
                    )?.name || shippingInfo.district,
                  ward:
                    wards.find((w) => w.code.toString() === shippingInfo.ward)
                      ?.name || shippingInfo.ward,
                  address: shippingInfo.address,
                  note: shippingInfo.note,
                }
              : null,
        };
      }

      const response = await orderService.createOrder(orderData);

      if (response.success) {
        if (paymentMethod === "vnpay") {
          try {
            const vnpayResponse = await orderService.createVNPayPayment(response.data.id);
            
            if (vnpayResponse.payment_url) {
              localStorage.setItem('pendingVNPayOrder', response.data.id);
              window.location.href = vnpayResponse.payment_url;
              return;
            } else {
              throw new Error('Không thể tạo URL thanh toán VNPay');
            }
          } catch (vnpayError) {
            console.error('VNPay payment error:', vnpayError);
            
            try {
              await orderService.cancelOrder(response.data.id);
            } catch (cancelError) {
              console.error('Error canceling order:', cancelError);
            }
            
            showError('Có lỗi xảy ra khi tạo thanh toán VNPay. Đơn hàng đã được hủy.');
            setIsProcessing(false);
            return;
          }
        }

        // Clear buy now item if exists
        if (buyNowItems) {
          localStorage.removeItem('buyNowItem');
        }
        
        // Always sync cart to ensure UI is updated
        await syncCartWithBackend();
        
        showSuccess("Đặt hàng thành công!");

        setTimeout(() => {
          navigate(`/order-success?orderId=${response.data.id}`);
        }, 100);
      } else {
        throw new Error(response.message || "Lỗi tạo đơn hàng");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.";
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Load provinces
  useEffect(() => {
    const loadProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        showError("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, [showError]);

  // Load shipping fee
  useEffect(() => {
    const loadShippingFee = async () => {
      try {
        const response = await orderService.getShippingFees();
        let fees = [];
        if (response && response.data && Array.isArray(response.data)) {
          fees = response.data;
        } else if (Array.isArray(response)) {
          fees = response;
        } else if (response && Array.isArray(response.results)) {
          fees = response.results;
        }

        const defaultFee = fees.find((fee) => fee.is_default) || fees[0];
        setShippingFee(defaultFee?.price || 0);
      } catch (error) {
        console.error("Error fetching shipping fee:", error);
      }
    };

    loadShippingFee();
  }, []);

  return {
    selectedItems,
    totalAmount,
    user,
    deliveryType,
    setDeliveryType,
    paymentMethod,
    setPaymentMethod,
    isProcessing,
    shippingFee,
    shippingInfo,
    provinces,
    districts,
    wards,
    loadingProvinces,
    loadingDistricts,
    loadingWards,
    handleInputChange,
    handlePlaceOrder
  };
};
