import React from 'react';

const CheckoutSummary = ({ 
  selectedItems, 
  totalAmount, 
  deliveryType, 
  shippingFee, 
  isProcessing, 
  onPlaceOrder 
}) => {
  return (
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
                deliveryType === "home_delivery"
                  ? "text-orange-600"
                  : "text-green-700"
              }
            >
              {deliveryType === "home_delivery"
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
              (deliveryType === "home_delivery" ? shippingFee : 0)
            ).toLocaleString()}{" "}
            đ
          </span>
        </div>

        <button
          onClick={onPlaceOrder}
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
  );
};

export default CheckoutSummary;
