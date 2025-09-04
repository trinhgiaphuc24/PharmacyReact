import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const SalesCart = ({ 
  selectedMedicines, 
  updateQuantity, 
  removeFromSalesCart, 
  getTotalAmount, 
  handlePayment, 
  isProcessing 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Thuốc đã chọn</h2>
      {selectedMedicines.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Chưa có thuốc nào được chọn</p>
      ) : (
        <div className="space-y-4">
          {selectedMedicines.map((medicine) => {
            const isOutOfStock = medicine.stock <= 0;
            const canIncrease = medicine.cartQuantity < medicine.stock && !isProcessing;
            const canDecrease = medicine.cartQuantity > 1 && !isProcessing;
            
            return (
              <div key={medicine.id} className={`flex items-center justify-between p-3 border border-gray-200 rounded-lg ${
                isOutOfStock ? 'bg-red-50 border-red-200' : ''
              }`}>
                <div className="flex-1">
                  <h3 className={`font-medium ${isOutOfStock ? 'text-red-700' : 'text-gray-800'}`}>
                    {medicine.name}
                  </h3>
                  <p className="text-sm text-gray-600">{medicine.price?.toLocaleString()}đ</p>
                  <p className={`text-xs ${
                    medicine.stock <= 0 
                      ? 'text-red-600 font-bold' 
                      : medicine.stock <= 10 
                        ? 'text-orange-600 font-medium' 
                        : 'text-gray-500'
                  }`}>
                    Kho: {medicine.stock}
                  </p>
                  {medicine.cartQuantity >= medicine.stock && medicine.stock > 0 && (
                    <p className="text-xs text-orange-600">Đã đạt giới hạn kho</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(medicine.id, medicine.cartQuantity - 1)}
                    className={`p-1 rounded-full ${
                      canDecrease 
                        ? 'bg-gray-100 hover:bg-gray-200' 
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!canDecrease}
                    title={!canDecrease ? 'Số lượng tối thiểu là 1' : 'Giảm số lượng'}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center">{medicine.cartQuantity}</span>
                  <button
                    onClick={() => updateQuantity(medicine.id, medicine.cartQuantity + 1)}
                    className={`p-1 rounded-full ${
                      canIncrease 
                        ? 'bg-gray-100 hover:bg-gray-200' 
                        : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!canIncrease}
                    title={!canIncrease ? `Kho chỉ còn ${medicine.stock} sản phẩm` : 'Tăng số lượng'}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => removeFromSalesCart(medicine.id)}
                    className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 ml-2"
                    disabled={isProcessing}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
          
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center text-lg font-semibold">
              <span>Tổng cộng:</span>
              <span className="text-green-700">{getTotalAmount().toLocaleString()}đ</span>
            </div>
            <button 
              onClick={handlePayment}
              disabled={isProcessing || selectedMedicines.length === 0}
              className="w-full mt-4 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Đang xử lý...' : 'Thanh toán'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesCart;
