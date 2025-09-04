import React from "react";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import Breadcrumb from "../ui/Breadcrumb";
import EmptyState from "../ui/EmptyState";
import CheckoutCustomerInfo from "../features/Checkout/CheckoutCustomerInfo";
import DeliveryTypeSelection from "../features/Checkout/DeliveryTypeSelection";
import ShippingAddressForm from "../features/Checkout/ShippingAddressForm";
import PaymentMethodSelection from "../features/Checkout/PaymentMethodSelection";
import CheckoutSummary from "../features/Checkout/CheckoutSummary";
import { useCheckout } from "../hooks/useCheckout";
import { FaShoppingCart } from "react-icons/fa";

const Checkout = () => {
  const {
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
  } = useCheckout();

  if (selectedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <EmptyState
          icon={FaShoppingCart}
          title="Không có sản phẩm để thanh toán"
          description="Vui lòng chọn sản phẩm để tiếp tục thanh toán"
          actionText="Quay lại giỏ hàng"
          actionLink="/cart"
        />
        <Footer />
        <Base />
      </div>
    );
  }

  const breadcrumbItems = [
    { link: '/cart', label: 'Giỏ hàng' },
    { label: 'Thanh toán' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      <div className="py-6 px-4">
        <div className="max-w-6xl mx-auto">
          <Breadcrumb items={breadcrumbItems} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <CheckoutCustomerInfo user={user} />

              <DeliveryTypeSelection 
                deliveryType={deliveryType}
                onDeliveryTypeChange={setDeliveryType}
              />

              {deliveryType === "home_delivery" && (
                <ShippingAddressForm
                  shippingInfo={shippingInfo}
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                  loadingProvinces={loadingProvinces}
                  loadingDistricts={loadingDistricts}
                  loadingWards={loadingWards}
                  onInputChange={handleInputChange}
                />
              )}

              <PaymentMethodSelection 
                paymentMethod={paymentMethod}
                onPaymentMethodChange={setPaymentMethod}
              />
            </div>

            <div className="lg:col-span-1">
              <CheckoutSummary
                selectedItems={selectedItems}
                totalAmount={totalAmount}
                deliveryType={deliveryType}
                shippingFee={shippingFee}
                isProcessing={isProcessing}
                onPlaceOrder={handlePlaceOrder}
              />
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
