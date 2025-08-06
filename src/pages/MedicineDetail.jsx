import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import axios, { endpoints } from "../utils/axiosConfig";

const MedicineDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { showSuccess, showError } = useToast();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [tab, setTab] = useState("Thành phần");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (medicine) {
      const result = addToCart(medicine, quantity);
      if (result.success) {
        showSuccess(`Đã thêm ${quantity} ${medicine.name} vào giỏ hàng!`);
      } else {
        showError(result.message || 'Không thể thêm vào giỏ hàng');
      }
    }
  };

  const formatLabels = {
    hop: "Hộp",
    chai: "Chai",
    tuyp: "Tuýp",
    cai: "Cái"
  };

  useEffect(() => {
    setLoading(true);
    axios.get(`${endpoints.medicines}/${id}/`)
      .then(res => setMedicine(res.data))
      .catch(() => setMedicine(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Đang tải...</div>;
  }

  return (
    <Base>
      <Header />
      {/* Section 1: Hình ảnh, tên, giá, nút mua, số lượng, phân loại, nhãn khuyến mãi */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          {/* Images */}
          <div className="flex flex-col items-center md:w-1/3">
            <div className="w-64 h-64 flex items-center justify-center mb-4">
              <img src={medicine.images && medicine.images.length > 0 ? medicine.images[selectedImg].imgMedicineUrl : "https://via.placeholder.com/100x100?text=No+Image"} alt="product" className="w-full h-full object-contain rounded-xl border" />
            </div>
            <div className="flex gap-2 mb-2">
              {medicine.images && medicine.images.map((img, idx) => (
                <img
                  key={img.id || idx}
                  src={img.imgMedicineUrl}
                  alt={`thumb-${idx}`}
                  className={`w-16 h-16 object-contain rounded-lg border cursor-pointer ${selectedImg === idx ? 'border-green-700' : 'border-gray-300'}`}
                  onClick={() => setSelectedImg(idx)}
                />
              ))}
            </div>
          </div>
          {/* Info & Details: Gộp chung 1 cột */}
          <div className="flex-1">
            {/* Thông tin chi tiết và mua */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">{medicine.name}</h1>
              <div className="flex items-center gap-4 mb-4 mb-5 mt-5">
                <span className="text-4xl font-bold text-green-700">{medicine.price ? medicine.price.toLocaleString() : ""} đ</span>
              </div>
              <div className="mb-2 font-bold text-gray-700">Mô tả</div>
              <div className="mb-4 text-gray-800">{medicine.description ? medicine.description : "Không có mô tả"}</div>
              <div className="mb-2 font-bold text-gray-700">Danh mục</div>
              <div className="mb-4 text-gray-800">{medicine.medicineGenre.name}</div>
              {/* Mua và số lượng */}
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold">Phân loại sản phẩm:</span>
                <span className="bg-gray-200 px-2 py-1 rounded">{formatLabels[medicine.format]}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="font-semibold">Số lượng:</span>
                <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setQuantity(q => Math.max(1, q-1))}>-</button>
                <span className="px-3 font-bold text-lg">{quantity}</span>
                <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setQuantity(q => q+1)}>+</button>
              </div>
              <div className="flex gap-4 mb-4">
                <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-lg transition shadow">Mua ngay</button>
                <button 
                  className="bg-white border border-green-700 text-green-700 font-semibold px-6 py-3 rounded-lg transition shadow hover:bg-green-50"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Section 3: Tabs & Details */}
      <div className="bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-24">
          <div className="flex gap-8 border-b mb-6">
            {['Thành phần', 'Công dụng', 'Cách sử dụng', 'Lưu ý sản phẩm', 'Thông tin sản xuất'].map((t) => (
              <button
                key={t}
                className={`pb-2 font-semibold text-base ${tab === t ? 'text-green-700 border-b-2 border-green-700' : 'text-gray-500'}`}
                onClick={() => setTab(t)}
              >{t}</button>
            ))}
          </div>
          <div className="mt-4">
            {tab === 'Thành phần' && (
              <div>
                <div className="text-gray-700 mb-4 whitespace-pre-line">{medicine.ingredient}</div>
              </div>
            )}
            {tab === 'Công dụng' && (
              <div>
                <div className="text-gray-700 mb-4 whitespace-pre-line">{medicine.benefit}</div>
              </div>
            )}
            {tab === 'Cách sử dụng' && (
              <div>
                <div className="text-gray-700 mb-4">{medicine.use}</div>
              </div>
            )}
            {tab === 'Lưu ý sản phẩm' && (
              <div>
                <div className="text-gray-700 mb-4">{medicine.note}</div>
              </div>
            )}
            {tab === 'Thông tin sản xuất' && (
              <div>
                <div className="text-gray-700 mb-4">{medicine.produce.name}.</div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </Base>
  );
};

export default MedicineDetail;