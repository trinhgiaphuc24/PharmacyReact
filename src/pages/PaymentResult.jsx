import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Header from '../ui/Header';
import Footer from '../ui/Footer';
import Base from '../ui/Base';
import Spinner from '../ui/Spinner';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const hasShownToast = useRef(false); // Prevent multiple toasts
  const hasSentEmail = useRef(false); // Prevent multiple email sends

  useEffect(() => {
    const checkPaymentResult = async () => {
      try {
        // Lấy order_id từ URL params
        const orderId = searchParams.get('order_id');
        const reason = searchParams.get('reason');
        
        if (!orderId) {
          setPaymentResult({ success: false, message: 'Không tìm thấy thông tin đơn hàng' });
          setIsLoading(false);
          return;
        }

        // Kiểm tra nếu có lỗi từ URL
        if (reason === 'payment_failed') {
          // Kiểm tra nếu có pending order và hủy đơn hàng
          const pendingOrderId = localStorage.getItem('pendingVNPayOrder');
          if (pendingOrderId) {
            try {
              await orderService.cancelOrder(pendingOrderId);
              localStorage.removeItem('pendingVNPayOrder');
            } catch (error) {
              console.error('Error canceling pending order:', error);
            }
          }
          
          setPaymentResult({ 
            success: false, 
            message: 'Thanh toán thất bại hoặc đã được hủy bỏ. Đơn hàng đã được hủy.' 
          });
          if (!hasShownToast.current) {
            showError('Thanh toán VNPay thất bại hoặc đã được hủy!');
            hasShownToast.current = true;
          }
          setIsLoading(false);
          return;
        }

        if (reason === 'order_not_found') {
          setPaymentResult({ 
            success: false, 
            message: 'Không tìm thấy đơn hàng. Vui lòng liên hệ hỗ trợ khách hàng.' 
          });
          if (!hasShownToast.current) {
            showError('Không tìm thấy đơn hàng!');
            hasShownToast.current = true;
          }
          setIsLoading(false);
          return;
        }

        // Kiểm tra trạng thái thanh toán từ backend
        const response = await orderService.checkPaymentStatus(orderId);
        
        if (response.payment_status === 'completed') {
          // Xóa pending order nếu có vì thanh toán thành công
          localStorage.removeItem('pendingVNPayOrder');
          
          setPaymentResult({ 
            success: true, 
            message: 'Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.' 
          });
          setOrderInfo(response);
          if (!hasShownToast.current) {
            showSuccess('Thanh toán VNPay thành công!');
            hasShownToast.current = true;
          }

          // Gửi email thông báo thanh toán thành công
          if (!hasSentEmail.current) {
            // Kiểm tra xem đã gửi email cho order này chưa
            const emailSentKey = `email_sent_${orderId}`;
            const alreadySent = localStorage.getItem(emailSentKey);
            
            if (!alreadySent) {
              hasSentEmail.current = true; // Set flag immediately
              try {
                await orderService.sendOrderEmail(orderId);
                localStorage.setItem(emailSentKey, 'true'); // Mark as sent
                console.log('VNPay order success email sent successfully');
              } catch (emailError) {
                console.error('Failed to send VNPay order email:', emailError);
                hasSentEmail.current = false; // Reset flag on error to allow retry
              }
            }
          }
        } else {
          // Thanh toán thất bại - hủy đơn hàng nếu có
          const pendingOrderId = localStorage.getItem('pendingVNPayOrder');
          if (pendingOrderId) {
            try {
              await orderService.cancelOrder(pendingOrderId);
              localStorage.removeItem('pendingVNPayOrder');
            } catch (error) {
              console.error('Error canceling pending order:', error);
            }
          }
          
          setPaymentResult({ 
            success: false, 
            message: 'Thanh toán chưa hoàn tất hoặc đã được hủy. Đơn hàng đã được hủy.' 
          });
          if (!hasShownToast.current) {
            showError('Thanh toán chưa hoàn tất!');
            hasShownToast.current = true;
          }
        }
        
      } catch (error) {
        console.error('Error checking payment result:', error);
        setPaymentResult({ 
          success: false, 
          message: 'Có lỗi xảy ra khi kiểm tra kết quả thanh toán. Vui lòng thử lại.' 
        });
        if (!hasShownToast.current) {
          showError('Không thể kiểm tra trạng thái thanh toán');
          hasShownToast.current = true;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentResult();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Chỉ dependency searchParams để tránh re-render

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center py-16">
          <Spinner />
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
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            {paymentResult?.success ? (
              <>
                <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Thanh toán thành công!
                </h1>
                <p className="text-gray-600 mb-6">
                  {paymentResult.message}
                </p>
                
                {orderInfo && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                    <h3 className="font-semibold text-gray-800 mb-2">Thông tin đơn hàng:</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p><span className="font-medium">Mã đơn hàng:</span> #{orderInfo.order_id}</p>
                      <p><span className="font-medium">Tổng tiền:</span> {orderInfo.total?.toLocaleString()} đ</p>
                      <p><span className="font-medium">Trạng thái:</span> {
                        orderInfo.order_status === 'waiting_for_pickup' ? 'Chờ lấy hàng' :
                        orderInfo.order_status === 'waiting_for_delivery' ? 'Chờ giao hàng' :
                        orderInfo.order_status
                      }</p>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to={orderInfo ? `/order-detail/${orderInfo.order_id}` : '/orders'}
                    className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition font-semibold"
                  >
                    Xem chi tiết đơn hàng
                  </Link>
                  <Link
                    to="/"
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </>
            ) : (
              <>
                <FaTimesCircle className="text-red-500 text-6xl mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  Thanh toán thất bại
                </h1>
                <p className="text-gray-600 mb-6">
                  {paymentResult?.message}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/orders"
                    className="bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition font-semibold"
                  >
                    Xem đơn hàng của tôi
                  </Link>
                  <Link
                    to="/"
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition font-semibold"
                  >
                    Về trang chủ
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default PaymentResult;
