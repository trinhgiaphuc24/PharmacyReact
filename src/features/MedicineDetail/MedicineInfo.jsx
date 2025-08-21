import React from 'react';

const MedicineInfo = ({ medicine }) => {
  const formatLabels = {
    hop: "Hộp",
    chai: "Chai",
    tuyp: "Tuýp",
    cai: "Cái"
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-2">
        {medicine.name}
      </h1>
      <div className="flex items-center gap-4 mb-4 mb-5 mt-5">
        <span className="text-4xl font-bold text-green-700">
          {medicine.price ? medicine.price.toLocaleString() : ""} đ
        </span>
      </div>
      <div className="mb-2 font-bold text-gray-700">Mô tả</div>
      <div className="mb-4 text-gray-800">
        {medicine.description ? medicine.description : "Không có mô tả"}
      </div>
      <div className="mb-2 font-bold text-gray-700">Danh mục</div>
      <div className="mb-4 text-gray-800">{medicine.medicineGenre.name}</div>
      <div className="flex items-center gap-2 mb-4">
        <span className="font-semibold">Phân loại sản phẩm:</span>
        <span className="bg-gray-200 px-2 py-1 rounded">
          {formatLabels[medicine.format]}
        </span>
      </div>
    </div>
  );
};

export default MedicineInfo;
