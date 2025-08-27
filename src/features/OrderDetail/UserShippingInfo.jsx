import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaUser, FaPhone, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { orderService } from '../../services/orderService';

const UserShippingInfo = ({ order, onOrderUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [currentShipInfo, setCurrentShipInfo] = useState(order.online_order?.ship_info || {});

  // Update local state when order prop changes
  useEffect(() => {
    if (order.online_order?.ship_info) {
      setCurrentShipInfo(order.online_order.ship_info);
    }
  }, [order]);
  // Load provinces on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        setLoadingProvinces(true);
        const response = await fetch('https://provinces.open-api.vn/api/p/');
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error('Error loading provinces:', error);
      } finally {
        setLoadingProvinces(false);
      }
    };

    loadProvinces();
  }, []);

  // Load districts when province changes
  useEffect(() => {
    if (formData.provinceCode) {
      const loadDistricts = async () => {
        try {
          setLoadingDistricts(true);
          const response = await fetch(`https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`);
          const data = await response.json();
          setDistricts(data.districts || []);
          setWards([]);
        } catch (error) {
          console.error('Error loading districts:', error);
        } finally {
          setLoadingDistricts(false);
        }
      };

      loadDistricts();
    }
  }, [formData.provinceCode]);

  // Load wards when district changes
  useEffect(() => {
    if (formData.districtCode) {
      const loadWards = async () => {
        try {
          setLoadingWards(true);
          const response = await fetch(`https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`);
          const data = await response.json();
          setWards(data.wards || []);
        } catch (error) {
          console.error('Error loading wards:', error);
        } finally {
          setLoadingWards(false);
        }
      };

      loadWards();
    }
  }, [formData.districtCode]);

  // Check if order can be edited (pending or waiting_for_pickup)
  const canEdit = order?.status === 'pending' || order?.status === 'waiting_for_pickup';

  if (order.online_order?.shipping_method !== 'home_delivery' || !currentShipInfo || Object.keys(currentShipInfo).length === 0) {
    return null;
  }

  const shipInfo = currentShipInfo;

  const handleEditClick = () => {
    setFormData({
      full_name: shipInfo.full_name,
      phoneNumber: shipInfo.phoneNumber,
      province: shipInfo.province,
      district: shipInfo.district,
      commune: shipInfo.commune,
      specific: shipInfo.specific,
      note: shipInfo.note || '',
      provinceCode: '',
      districtCode: '',
      wardCode: ''
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({});
    setDistricts([]);
    setWards([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'provinceCode') {
      const selectedProvince = provinces.find(p => p.code.toString() === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        province: selectedProvince?.name || '',
        districtCode: '',
        district: '',
        wardCode: '',
        commune: ''
      }));
    } else if (name === 'districtCode') {
      const selectedDistrict = districts.find(d => d.code.toString() === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        district: selectedDistrict?.name || '',
        wardCode: '',
        commune: ''
      }));
    } else if (name === 'wardCode') {
      const selectedWard = wards.find(w => w.code.toString() === value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        commune: selectedWard?.name || ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Check authentication
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      if (!token) {
        alert('Vui lòng đăng nhập lại');
        return;
      }
      
      // Validate required fields
      if (!formData.full_name || !formData.phoneNumber) {
        alert('Vui lòng điền đầy đủ họ tên và số điện thoại');
        return;
      }
      
      // Prepare data for API call (only send required fields)
      const updateData = {
        full_name: formData.full_name.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        province: formData.province || '',
        district: formData.district || '',
        commune: formData.commune || '',
        specific: formData.specific?.trim() || '',
        note: formData.note?.trim() || ''
      };
      
      console.log('Sending update data:', updateData);
      console.log('Order ID:', order.id);
      
      const response = await orderService.updateShippingInfo(order.id, updateData);
      if (response.success) {
        setIsEditing(false);
        
        // Update local state immediately to show changes
        const updatedShipInfo = {
          full_name: updateData.full_name,
          phoneNumber: updateData.phoneNumber,
          province: updateData.province,
          district: updateData.district,
          commune: updateData.commune,
          specific: updateData.specific,
          note: updateData.note
        };
        setCurrentShipInfo(updatedShipInfo);
        
        // Update parent component with new order data
        if (onOrderUpdate) {
          onOrderUpdate(response.data);
        }
        
        alert('Cập nhật thông tin giao hàng thành công!');
      }
    } catch (error) {
      console.error('Error updating shipping info:', error);
      console.error('Error response:', error.response?.data);
      alert(`Có lỗi xảy ra: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-700" />
          <h3 className="text-lg font-semibold text-gray-800">Thông tin giao hàng</h3>
        </div>
        {canEdit && !isEditing && (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors"
          >
            <FaEdit className="w-3 h-3" />
            Chỉnh sửa
          </button>
        )}
        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FaTimes className="w-3 h-3" />
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-1 px-3 py-1 text-sm text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              <FaSave className="w-3 h-3" />
              {loading ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        )}
      </div>
      
      {!isEditing ? (
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
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
            <select
              name="provinceCode"
              value={formData.provinceCode || ''}
              onChange={handleInputChange}
              disabled={loadingProvinces}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Chọn tỉnh/thành phố</option>
              {provinces.map(province => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
            <select
              name="districtCode"
              value={formData.districtCode || ''}
              onChange={handleInputChange}
              disabled={loadingDistricts || !formData.provinceCode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Chọn quận/huyện</option>
              {districts.map(district => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phường/Xã</label>
            <select
              name="wardCode"
              value={formData.wardCode || ''}
              onChange={handleInputChange}
              disabled={loadingWards || !formData.districtCode}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Chọn phường/xã</option>
              {wards.map(ward => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</label>
            <input
              type="text"
              name="specific"
              value={formData.specific || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
            <textarea
              name="note"
              value={formData.note || ''}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserShippingInfo;