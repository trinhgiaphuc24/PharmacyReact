import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import staffSalesService from '../services/staffSalesService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

export const useStaffSales = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { user } = useAuth();

  const createDirectSale = async (customerInfo, selectedMedicines) => {
    if (isProcessing) return;
    
    // Check authentication và role
    if (!user) {
      showError('Vui lòng đăng nhập để tiếp tục');
      navigate('/login');
      return;
    }
    
    if (user.userRole !== 'staff') {
      showError('Chỉ staff mới có quyền bán trực tiếp');
      return;
    }
    
    // Validate dữ liệu
    if (!customerInfo.lastName?.trim()) {
      showError('Vui lòng nhập họ và tên khách hàng');
      return;
    }

    if (!customerInfo.phoneNumber?.trim()) {
      showError('Vui lòng nhập số điện thoại khách hàng');
      return;
    }

    // Validate phone number format - chỉ check là số
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(customerInfo.phoneNumber.trim())) {
      showError('Số điện thoại chỉ được chứa các chữ số');
      return;
    }

    if (selectedMedicines.length === 0) {
      showError('Vui lòng chọn ít nhất một thuốc');
      return;
    }

    setIsProcessing(true);

    try {
      // Chuẩn bị dữ liệu gửi API
      const orderData = {
        customer_name: customerInfo.lastName,
        phone_number: customerInfo.phoneNumber,
        medicines: selectedMedicines.map(medicine => ({
          medicine_id: medicine.id,
          quantity: medicine.cartQuantity || medicine.quantity // Use cartQuantity first, fallback to quantity
        }))
      };

      // Gọi API
      const response = await staffSalesService.createDirectSale(orderData);

      if (response.success) {
        showSuccess('Bán hàng thành công!');
        
        // Redirect tới trang order detail hoặc success page
        const orderId = response.data.order.id;
        navigate(`/staff/orders/${orderId}`);
      } else {
        showError(response.message || 'Có lỗi xảy ra khi bán hàng');
      }
    } catch (error) {
      console.error('Direct sale error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Có lỗi xảy ra khi xử lý đơn hàng';
      
      showError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    createDirectSale
  };
};
