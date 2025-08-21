import React from 'react';

const ImageGallery = ({ images, selectedImg, setSelectedImg }) => {
  const defaultImage = "https://via.placeholder.com/100x100?text=No+Image";
  const mainImage = images && images.length > 0 ? images[selectedImg]?.imgMedicineUrl : defaultImage;

  return (
    <div className="flex flex-col items-center md:w-1/3">
      <div className="w-64 h-64 flex items-center justify-center mb-4">
        <img 
          src={mainImage} 
          alt="product" 
          className="w-full h-full object-contain rounded-xl border" 
        />
      </div>
      <div className="flex gap-2 mb-2">
        {images && images.map((img, idx) => (
          <img
            key={img.id || idx}
            src={img.imgMedicineUrl}
            alt={`thumb-${idx}`}
            className={`w-16 h-16 object-contain rounded-lg border cursor-pointer ${
              selectedImg === idx ? 'border-green-700' : 'border-gray-300'
            }`}
            onClick={() => setSelectedImg(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
