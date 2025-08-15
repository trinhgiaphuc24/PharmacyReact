import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { orderService } from "../services/orderService";
import {
  FaArrowLeft,
  FaCreditCard,
  FaWallet,
  FaMapMarkerAlt,
  FaUser,
  FaShoppingCart,
  FaTruck,
  FaStore,
} from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const { getSelectedCartItems, getSelectedAmount, syncCartWithBackend } =
    useCart();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();

  const selectedItems = getSelectedCartItems();
  const totalAmount = getSelectedAmount();

  const [deliveryType, setDeliveryType] = useState("pickup");

  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    note: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  // Address data states
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  // Shipping fee state
  const [shippingFee, setShippingFee] = useState(0);
  const [loadingShippingFee, setLoadingShippingFee] = useState(false);

  // Payment methods data
  const paymentMethods = [
    {
      id: "cod",
      name: "Thanh toán tiền mặt khi nhận hàng",
      icon: FaCreditCard,
      description: "Thanh toán khi nhận hàng",
    },
    {
      id: "vnpay",
      name: "Thanh toán qua VNPay",
      icon: FaWallet,
      description: "Ví điện tử VNPay",
    },
  ];

  // API functions for address data
  const fetchDistricts = async (provinceCode) => {
    setLoadingDistricts(true);
    try {
      const response = await fetch(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      const data = await response.json();
      setDistricts(data.districts || []);
      setWards([]); // Reset wards when province changes
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

  // Load provinces on component mount
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

  // Load shipping fee on component mount
  useEffect(() => {
    const loadShippingFee = async () => {
      setLoadingShippingFee(true);
      try {
        const response = await orderService.getShippingFees();
        // Handle different response formats
        let fees = [];
        if (response && response.data && Array.isArray(response.data)) {
          fees = response.data;
        } else if (Array.isArray(response)) {
          fees = response;
        } else if (response && Array.isArray(response.results)) {
          fees = response.results;
        }

        // Find default fee or use first one
        const defaultFee = fees.find((fee) => fee.is_default) || fees[0];
        setShippingFee(defaultFee.price);
      } catch (error) {
        console.error("Error fetching shipping fee:", error); // Default 30k nếu có lỗi
      } finally {
        setLoadingShippingFee(false);
      }
    };

    loadShippingFee();
  }, []);

  const handleInputChange = (section, field, value) => {
    if (section === "shipping") {
      setShippingInfo((prev) => ({ ...prev, [field]: value }));

      // Handle address-specific changes
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
    // Chỉ validate địa chỉ ship nếu chọn giao hàng tận nơi
    if (deliveryType === "delivery") {
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
      // Debug: Log selectedItems để kiểm tra cấu trúc
      console.log("Selected items:", selectedItems);

      // Prepare order data
      const orderData = {
        delivery_type: deliveryType,
        payment_method: paymentMethod,
        // Sử dụng ID của cart items, thử nhiều trường có thể
        selected_items: selectedItems
          .map((item) => {
            // Log từng item để debug
            console.log("Item structure:", item);
            return item.cartItemId || item.id || item.cart_item_id;
          })
          .filter((id) => id !== undefined), // Loại bỏ undefined
        shipping_info:
          deliveryType === "delivery"
            ? {
                full_name: shippingInfo.fullName,
                phone: shippingInfo.phone,
                // Lưu tên thay vì code
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

      // Debug: Log orderData trước khi gửi
      console.log("Order data to send:", orderData);

      // Create order through API first
      const response = await orderService.createOrder(orderData);

      if (response.success) {
        // If VNPay is selected, create payment URL and redirect
        if (paymentMethod === "vnpay") {
          try {
            const vnpayResponse = await orderService.createVNPayPayment(response.data.id);
            
            if (vnpayResponse.payment_url) {
              // Lưu order ID để kiểm tra sau này
              localStorage.setItem('pendingVNPayOrder', response.data.id);
              
              // Redirect to VNPay payment page
              window.location.href = vnpayResponse.payment_url;
              return;
            } else {
              throw new Error('Không thể tạo URL thanh toán VNPay');
            }
          } catch (vnpayError) {
            console.error('VNPay payment error:', vnpayError);
            
            // Nếu có lỗi VNPay, xóa đơn hàng vừa tạo
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

        // Sync cart for COD orders
        await syncCartWithBackend();
        showSuccess("Đặt hàng thành công!");

        // Redirect to order success page for COD
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

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto py-16 px-4 text-center">
          <FaShoppingCart className="mx-auto text-6xl text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-4">
            Không có sản phẩm để thanh toán
          </h2>
          <Link to="/cart" className="text-green-700 hover:underline">
            Quay lại giỏ hàng
          </Link>
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <Link
              to="/cart"
              className="flex items-center gap-1 hover:text-green-700"
            >
              <FaArrowLeft className="text-xs" />
              Giỏ hàng
            </Link>
            <span>/</span>
            <span className="text-green-700 font-medium">Thanh toán</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information - Hiển thị gọn */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FaUser className="text-green-700" />
                  <h2 className="text-lg font-semibold text-gray-800">
                    Thông tin người đặt
                  </h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <span className="w-32 text-gray-700 font-medium">
                      Họ và tên:
                    </span>
                    <span className="text-gray-900">
                      {user?.first_name + " " + user?.last_name || ""}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-700 font-medium">
                      Số điện thoại:
                    </span>
                    <span className="text-gray-900">
                      {user?.phone_number || ""}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-32 text-gray-700 font-medium">
                      Email:
                    </span>
                    <span className="text-gray-900">{user?.email || ""}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Type Selection */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Chọn hình thức nhận hàng
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                      deliveryType === "pickup"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value="pickup"
                      checked={deliveryType === "pickup"}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="w-4 h-4 text-green-700 border-gray-300 focus:ring-green-500"
                    />
                    <FaStore className="text-lg text-green-700" />
                    <div>
                      <div className="font-medium text-gray-800">
                        Nhận hàng tại nhà thuốc
                      </div>
                      <div className="text-sm text-gray-500">
                        Đến nhà thuốc để nhận hàng
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                      deliveryType === "delivery"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="deliveryType"
                      value="delivery"
                      checked={deliveryType === "delivery"}
                      onChange={(e) => setDeliveryType(e.target.value)}
                      className="w-4 h-4 text-green-700 border-gray-300 focus:ring-green-500"
                    />
                    <FaTruck className="text-lg text-green-700" />
                    <div>
                      <div className="font-medium text-gray-800">
                        Giao hàng tận nơi
                      </div>
                      <div className="text-sm text-gray-500">
                        Giao hàng đến địa chỉ của bạn
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Shipping Address - Only show if delivery type is "delivery" */}
              {deliveryType === "delivery" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FaMapMarkerAlt className="text-green-700" />
                    <h2 className="text-lg font-semibold text-gray-800">
                      Địa chỉ nhận hàng
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên người nhận
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.fullName}
                        onChange={(e) =>
                          handleInputChange(
                            "shipping",
                            "fullName",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập họ và tên"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          handleInputChange("shipping", "phone", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn tỉnh/thành phố
                      </label>
                      <select
                        value={shippingInfo.province}
                        onChange={(e) =>
                          handleInputChange(
                            "shipping",
                            "province",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={loadingProvinces}
                      >
                        <option value="">
                          {loadingProvinces
                            ? "Đang tải..."
                            : "Chọn tỉnh/thành phố"}
                        </option>
                        {provinces.map((province) => (
                          <option key={province.code} value={province.code}>
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn quận/huyện
                      </label>
                      <select
                        value={shippingInfo.district}
                        onChange={(e) =>
                          handleInputChange(
                            "shipping",
                            "district",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={loadingDistricts || !shippingInfo.province}
                      >
                        <option value="">
                          {loadingDistricts
                            ? "Đang tải..."
                            : !shippingInfo.province
                            ? "Vui lòng chọn tỉnh/thành phố trước"
                            : "Chọn quận/huyện"}
                        </option>
                        {districts.map((district) => (
                          <option key={district.code} value={district.code}>
                            {district.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn phường/xã
                      </label>
                      <select
                        value={shippingInfo.ward}
                        onChange={(e) =>
                          handleInputChange("shipping", "ward", e.target.value)
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={loadingWards || !shippingInfo.district}
                      >
                        <option value="">
                          {loadingWards
                            ? "Đang tải..."
                            : !shippingInfo.district
                            ? "Vui lòng chọn quận/huyện trước"
                            : "Chọn phường/xã"}
                        </option>
                        {wards.map((ward) => (
                          <option key={ward.code} value={ward.code}>
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nhập địa chỉ cụ thể
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) =>
                          handleInputChange(
                            "shipping",
                            "address",
                            e.target.value
                          )
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ví dụ: Số 123, đường ABC"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ghi chú (không bắt buộc)
                      </label>
                      <textarea
                        value={shippingInfo.note}
                        onChange={(e) =>
                          handleInputChange("shipping", "note", e.target.value)
                        }
                        rows="3"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ví dụ: Hãy gọi cho tôi 15 phút trước khi giao"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Chọn phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const IconComponent = method.icon;
                    return (
                      <label
                        key={method.id}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                          paymentMethod === method.id
                            ? "border-green-500 bg-green-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="w-4 h-4 text-green-700 border-gray-300 focus:ring-green-500"
                        />
                        <IconComponent className="text-lg text-gray-600" />
                        <div>
                          <div className="font-medium text-gray-800">
                            {method.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {method.description}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm sticky top-4">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold text-gray-800">
                    Tóm tắt đơn hàng
                  </h2>
                </div>

                <div className="p-4">
                  <div className="space-y-3 mb-4">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                        <div className="flex-1">
                          <div className="text-sm text-gray-800 line-clamp-2">
                            {item.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            SL: {item.quantity}
                          </div>
                          <div className="text-sm font-medium text-green-700">
                            {(item.price * item.quantity).toLocaleString()} đ
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <hr className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span>{totalAmount.toLocaleString()} đ</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phí vận chuyển</span>
                      <span
                        className={
                          deliveryType === "delivery"
                            ? "text-orange-600"
                            : "text-green-700"
                        }
                      >
                        {deliveryType === "delivery"
                          ? `${shippingFee.toLocaleString()} đ`
                          : "Miễn phí"}
                      </span>
                    </div>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between text-lg font-bold">
                    <span>Thành tiền</span>
                    <span className="text-green-700">
                      {(
                        totalAmount +
                        (deliveryType === "delivery" ? shippingFee : 0)
                      ).toLocaleString()}{" "}
                      đ
                    </span>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isProcessing}
                    className={`w-full mt-6 py-3 rounded-lg font-semibold transition ${
                      isProcessing
                        ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                        : "bg-green-700 text-white hover:bg-green-800"
                    }`}
                  >
                    {isProcessing ? "Đang xử lý..." : "Hoàn tất"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Base />
    </div>
  );
};

export default Checkout;
