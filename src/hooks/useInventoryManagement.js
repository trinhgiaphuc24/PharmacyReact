import { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { createAuthenticatedAxios } from '../utils/axiosConfig';

export const useInventoryManagement = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { showSuccess, showError } = useToast();

  const updateMedicineQuantity = async (medicineId, newQuantity) => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      const axios = createAuthenticatedAxios();
      const response = await axios.patch(`/medicines/${medicineId}/`, {
        quantity: newQuantity
      });

      if (response.status === 200) {
        showSuccess(`Cập nhật tồn kho thành công! Số lượng mới: ${newQuantity}`);
        return response.data;
      } else {
        throw new Error('Cập nhật không thành công');
      }
    } catch (error) {
      console.error('Update quantity error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Có lỗi xảy ra khi cập nhật tồn kho';
      
      showError(errorMessage);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    updateMedicineQuantity
  };
};
