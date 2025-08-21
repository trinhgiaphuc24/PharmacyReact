import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

const ShippingAddressForm = ({
  shippingInfo,
  provinces,
  districts,
  wards,
  loadingProvinces,
  loadingDistricts,
  loadingWards,
  onInputChange
}) => {
  return (
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
              onInputChange("shipping", "fullName", e.target.value)
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
              onInputChange("shipping", "phone", e.target.value)
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
              onInputChange("shipping", "province", e.target.value)
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loadingProvinces}
          >
            <option value="">
              {loadingProvinces ? "Đang tải..." : "Chọn tỉnh/thành phố"}
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
              onInputChange("shipping", "district", e.target.value)
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
              onInputChange("shipping", "ward", e.target.value)
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
              onInputChange("shipping", "address", e.target.value)
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
              onInputChange("shipping", "note", e.target.value)
            }
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Ví dụ: Hãy gọi cho tôi 15 phút trước khi giao"
          />
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressForm;
