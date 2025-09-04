import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useToast } from "../../context/ToastContext";
import { useAuth } from "../../context/AuthContext";

const MedicineList = ({ medicines = [], onMedicineSelect }) => {
  const { addToCart } = useCart();
  const { showSuccess, showError, showInfo } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const isStaff = user?.userRole === 'staff';

  const handleAddToCart = async (medicine, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoggedIn) {
      showInfo('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      localStorage.setItem('redirectAfterLogin', '/medicines');
      navigate('/login');
      return;
    }
    
    // Check stock before adding to cart
    if (medicine.quantity <= 0) {
      showError('Sản phẩm này đã hết hàng');
      return;
    }
    
    const result = await addToCart(medicine, 1);
    if (result.success) {
      showSuccess(`${medicine.name} đã được thêm vào giỏ hàng!`);
    } else {
      showError(result.message || 'Không thể thêm vào giỏ hàng');
    }
  };

  const handleMedicineSelect = (medicine, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check stock before selecting for staff sales
    if (medicine.quantity <= 0) {
      showError('Sản phẩm này đã hết hàng');
      return;
    }
    
    if (onMedicineSelect) {
      onMedicineSelect(medicine);
      showSuccess(`${medicine.name} đã được chọn!`);
    }
  };

  if (!medicines || medicines.length === 0) {
    return <div className="text-center py-8">Không có dữ liệu thuốc.</div>;
  }

  return (
    <div className="mt-5 bg-green-50 p-2 rounded-xl">
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4`}>
        {medicines.map((medicine, idx) => {
          const isOutOfStock = medicine.quantity <= 0;
          
          return (
            <div
              key={medicine.id || idx}
              className="bg-white rounded-lg shadow hover:shadow-md p-3 flex flex-col justify-between relative"
            >
              <Link
                className="cursor-pointer block"
                to={`/medicines/${medicine.id}/`}
              >
                <img
                  src={medicine.images && medicine.images.length > 0 ? medicine.images[0].imgMedicineUrl : "https://via.placeholder.com/100x100?text=No+Image"}
                  alt={medicine.name || medicine.title}
                  className="w-full h-24 object-contain mb-2"
                />
                <div className="text-sm font-semibold text-gray-800 truncate">
                  {medicine.name || medicine.title}
                </div>
                <div className="mt-1">
                  <p className="text-green-700 font-bold text-sm">{medicine.price ? medicine.price.toLocaleString() + " đ" : ""}</p>
                </div>
              </Link>
              {isStaff && onMedicineSelect ? (
                <button 
                  className={`mt-2 text-sm font-semibold py-1 rounded border ${
                    isOutOfStock 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300' 
                      : 'bg-green-700 hover:bg-green-800 text-white border-green-700'
                  }`}
                  onClick={(e) => handleMedicineSelect(medicine, e)}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? 'Hết hàng' : 'Chọn'}
                </button>
              ) : (
                <button 
                  className={`mt-2 text-sm font-semibold py-1 rounded border ${
                    isOutOfStock 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-gray-300' 
                      : 'bg-green-700 hover:bg-green-800 text-white border-green-700'
                  }`}
                  onClick={(e) => handleAddToCart(medicine, e)}
                  disabled={isOutOfStock}
                >
                  {isOutOfStock ? 'Hết hàng' : 'Thêm vào giỏ'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MedicineList;
