import { useState, useEffect } from 'react';
import api, { endpoints } from '../utils/axiosConfig';

export const useBestSellingMedicines = () => {
  const [bestSellingMedicines, setBestSellingMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBestSellingMedicines = async () => {
      try {
        setLoading(true);
        const response = await api.get(endpoints['best-selling-medicines']);
        
        if (response.data.success) {
          setBestSellingMedicines(response.data.data);
        } else {
          setError('Không thể tải dữ liệu thuốc bán chạy');
        }
      } catch (error) {
        console.error('Error fetching best selling medicines:', error);
        setError('Lỗi khi tải dữ liệu thuốc bán chạy');
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellingMedicines();
  }, []);

  return {
    bestSellingMedicines,
    loading,
    error
  };
};
