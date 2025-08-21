import React from 'react';
import { FaMapMarkerAlt, FaUser, FaPhone } from 'react-icons/fa';

const UserShippingInfo = ({ order }) => {
  if (order.online_order?.shipping_method !== 'home_delivery' || !order.online_order?.ship_info) {
    return null;
  }

  const shipInfo = order.online_order.ship_info;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FaMapMarkerAlt className="text-green-700" />
        <h3 className="text-lg font-semibold text-gray-800">Thông tin giao hàng</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FaUser className="text-gray-500" />
          <span>{shipInfo.full_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <FaPhone className="text-gray-500" />
          <span>{shipInfo.phoneNumber}</span>
        </div>
        <div className="flex items-start gap-2">
          <FaMapMarkerAlt className="text-gray-500 mt-1" />
          <div>
            <p>{shipInfo.specific}</p>
            <p className="text-gray-600">
              {shipInfo.commune}, {shipInfo.district}, {shipInfo.province}
            </p>
            {shipInfo.note && (
              <p className="text-gray-600 italic">Ghi chú: {shipInfo.note}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserShippingInfo;
