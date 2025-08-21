import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessMessage = () => {
  return (
    <div className="text-center py-16">
      <FaCheckCircle className="mx-auto text-6xl text-green-700 mb-6" />
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h2>
      <p className="text-gray-600 mb-8 text-lg">
        Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng và liên hệ với bạn sớm nhất.
      </p>
    </div>
  );
};

export default SuccessMessage;
