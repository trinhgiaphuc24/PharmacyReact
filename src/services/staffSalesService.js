import { endpoints, createAuthenticatedAxios } from '../utils/axiosConfig';

const staffSalesService = {
  // Tạo đơn hàng bán trực tiếp
  createDirectSale: async (orderData) => {
    try {
      const axios = createAuthenticatedAxios();
      const response = await axios.post(`${endpoints.orders}staff-direct-sale/`, orderData);
      return response.data;
    } catch (error) {
      console.error('Staff direct sale error:', error);
      throw error;
    }
  }
};

export default staffSalesService;
