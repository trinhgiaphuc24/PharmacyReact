import React from 'react';

const ShippingInfo = ({ shippingInfo, isHomeDelivery }) => {
  if (!isHomeDelivery || !shippingInfo) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold mb-4">Thông tin nhận hàng</h3>
      <div className="space-y-3">
        <div>
          <span className="text-sm text-gray-500">Người nhận:</span>
          <div className="font-medium">{shippingInfo.full_name}</div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Số điện thoại:</span>
          <div className="font-medium">{shippingInfo.phoneNumber}</div>
        </div>
        <div>
          <span className="text-sm text-gray-500">Địa chỉ:</span>
          <div className="font-medium">
            {`${shippingInfo.specific}, ${shippingInfo.commune}, ${shippingInfo.district}, ${shippingInfo.province}`}
          </div>
        </div>
        {shippingInfo.note && (
          <div>
            <span className="text-sm text-gray-500">Ghi chú:</span>
            <div className="font-medium text-sm bg-gray-50 p-2 rounded">
              {shippingInfo.note}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShippingInfo;
