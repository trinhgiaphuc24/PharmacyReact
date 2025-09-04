import React, { useState } from 'react';

const InventoryMedicineCard = ({ medicine, onUpdateQuantity, isUpdating }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newQuantity, setNewQuantity] = useState(medicine.quantity || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateQuantity(medicine.id, newQuantity);
    setShowUpdateForm(false);
  };

  const handleCancel = () => {
    setNewQuantity(medicine.quantity || 0);
    setShowUpdateForm(false);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md p-3 flex flex-col justify-between">
      {/* Medicine Image */}
      <div>
        <img
          src={medicine.images && medicine.images.length > 0 ? medicine.images[0].imgMedicineUrl : "https://via.placeholder.com/100x100?text=No+Image"}
          alt={medicine.name || medicine.title}
          className="w-full h-24 object-contain mb-2"
        />
        
        {/* Medicine Info */}
        <div className="text-sm font-semibold text-gray-800 truncate">
          {medicine.name || medicine.title}
        </div>
        
        <div className="mt-1">
          <p className="text-green-700 font-bold text-sm">
            {medicine.price ? medicine.price.toLocaleString() + " đ" : ""}
          </p>
        </div>

        {/* Quantity Display */}
        <div className="flex items-center gap-1 text-xs mt-1">
          <span className="text-gray-600">Số lượng tồn kho:</span>
          <span className={`font-semibold ${medicine.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {medicine.quantity || 0}
          </span>
        </div>
      </div>

      {/* Update Quantity Button/Form */}
      <div className="mt-2">
        {showUpdateForm ? (
          <form onSubmit={handleSubmit} className="space-y-1">
            <input
              type="number"
              value={newQuantity}
              onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-green-500"
              placeholder="Số lượng mới"
              disabled={isUpdating}
            />
            <div className="flex gap-1">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex-1 bg-green-600 text-white py-1 px-2 rounded text-xs hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {isUpdating ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={isUpdating}
                className="flex-1 bg-gray-300 text-gray-700 py-1 px-2 rounded text-xs hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setShowUpdateForm(true)}
            className="w-full bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-1 rounded border border-green-700"
          >
            Cập nhật tồn kho
          </button>
        )}
      </div>
    </div>
  );
};

export default InventoryMedicineCard;
