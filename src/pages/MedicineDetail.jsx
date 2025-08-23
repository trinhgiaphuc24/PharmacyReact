import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import LoadingSpinner from "../ui/LoadingSpinner";
import QuantitySelector from "../ui/QuantitySelector";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import { useMedicineDetail } from "../hooks/useMedicineDetail";
import ImageGallery from "../features/MedicineDetail/ImageGallery";
import MedicineInfo from "../features/MedicineDetail/MedicineInfo";
import ActionButtons from "../features/MedicineDetail/ActionButtons";
import MedicineDetailTabs from "../features/MedicineDetail/MedicineDetailTabs";

const MedicineDetail = () => {
  const navigate = useNavigate();
  const { addToCart, buyNow } = useCart();
  const { showSuccess, showError } = useToast();
  const {
    medicine,
    loading,
    selectedImg,
    setSelectedImg,
    tab,
    setTab,
    quantity,
    incrementQuantity,
    decrementQuantity
  } = useMedicineDetail();

  const handleAddToCart = async () => {
    if (medicine) {
      const result = await addToCart(medicine, quantity);
      if (result.success) {
        showSuccess(`Đã thêm ${quantity} ${medicine.name} vào giỏ hàng!`);
      } else {
        showError(result.message || 'Không thể thêm vào giỏ hàng');
      }
    }
  };

  const handleBuyNow = () => {
    if (medicine) {
      const result = buyNow(medicine, quantity);
      if (result.success) {
        navigate('/checkout');
      } else {
        showError(result.message || 'Không thể thực hiện mua ngay');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-500">Không tìm thấy sản phẩm</div>
      </div>
    );
  }

  return (
    <Base>
      <Header />
      {/* Section 1: Product Overview */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          <ImageGallery 
            images={medicine.images} 
            selectedImg={selectedImg} 
            setSelectedImg={setSelectedImg} 
          />
          <div className="flex-1">
            <MedicineInfo medicine={medicine} />
            <QuantitySelector 
              quantity={quantity}
              onIncrement={incrementQuantity}
              onDecrement={decrementQuantity}
            />
            <ActionButtons 
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>
      </div>
      
      {/* Section 2: Detailed Information */}
      <MedicineDetailTabs 
        medicine={medicine}
        tab={tab}
        setTab={setTab}
      />
      
      <Footer />
    </Base>
  );
};

export default MedicineDetail;