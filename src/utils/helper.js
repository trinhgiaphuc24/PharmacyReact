export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('vi-VN');
};
