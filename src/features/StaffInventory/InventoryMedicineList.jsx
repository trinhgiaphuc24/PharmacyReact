import React from 'react';
import InventoryMedicineCard from './InventoryMedicineCard';
import { Package } from 'lucide-react';

const InventoryMedicineList = ({ medicines, onUpdateQuantity, isUpdating }) => {
  if (!medicines || medicines.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">Không có thuốc nào được tìm thấy</p>
      </div>
    );
  }

  return (
    <div className="mt-5 bg-green-50 p-2 rounded-xl">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {medicines.map((medicine) => (
          <InventoryMedicineCard
            key={medicine.id}
            medicine={medicine}
            onUpdateQuantity={onUpdateQuantity}
            isUpdating={isUpdating}
          />
        ))}
      </div>
    </div>
  );
};

export default InventoryMedicineList;
