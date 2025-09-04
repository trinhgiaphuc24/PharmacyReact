import React from 'react';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import Base from '../ui/Base';
import LoadingSpinner from '../ui/LoadingSpinner';
import PaymentSuccess from '../features/Payment/PaymentSuccess';
import PaymentError from '../features/Payment/PaymentError';
import { usePaymentResult } from '../hooks/usePaymentResult';

const PaymentResult = () => {
  const { isLoading, paymentResult, orderInfo } = usePaymentResult();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner message="Đang xử lý kết quả thanh toán..." />
        </div>
        <Footer />
        <Base />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {paymentResult?.success ? (
            <PaymentSuccess paymentResult={paymentResult} orderInfo={orderInfo} />
          ) : (
            <PaymentError paymentResult={paymentResult} />
          )}
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default PaymentResult;
