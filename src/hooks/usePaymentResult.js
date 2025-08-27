import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { useToast } from '../context/ToastContext';
import { useNotifications } from '../context/NotificationContext';

export const usePaymentResult = () => {
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();
  const { addNotification, notifications } = useNotifications();
  
  const [isLoading, setIsLoading] = useState(true);
  const [paymentResult, setPaymentResult] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const hasShownToast = useRef(false);
  const hasSentEmail = useRef(false);

  useEffect(() => {
    const checkPaymentResult = async () => {
      try {
        const orderId = searchParams.get('order_id');
        const reason = searchParams.get('reason');
        
        if (!orderId) {
          setPaymentResult({ success: false, message: 'Không tìm thấy thông tin đơn hàng' });
          setIsLoading(false);
          return;
        }

        // Handle payment failed from URL
        if (reason === 'payment_failed') {
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

        // Check payment status from backend
        const response = await orderService.checkPaymentStatus(orderId);
        
        if (response.payment_status === 'completed') {
          localStorage.removeItem('pendingVNPayOrder');
          
          setPaymentResult({ 
            success: true, 
            message: 'Thanh toán thành công! Đơn hàng của bạn đã được xác nhận.' 
          });
          setOrderInfo(response);
          
          // Thêm notification manual cho VNPay chỉ khi chưa có notification từ WebSocket
          const existingNotification = notifications.find(notif => 
            notif.data?.order_id === orderId && notif.data?.type === 'order_created'
          );
          
          if (!existingNotification) {
            addNotification({
              title: 'Đặt hàng thành công',
              body: `Đặt hàng thành công! Đơn hàng #${orderId}`,
              data: {
                type: 'order_created',
                order_id: orderId
              }
            });
          }

          // Send email notification
          if (!hasSentEmail.current) {
            const emailSentKey = `email_sent_${orderId}`;
            const alreadySent = localStorage.getItem(emailSentKey);
            
            if (!alreadySent) {
              hasSentEmail.current = true;
              try {
                await orderService.sendOrderEmail(orderId);
                localStorage.setItem(emailSentKey, 'true');
                // VNPay order success email sent successfully
              } catch (emailError) {
                console.error('Failed to send VNPay order email:', emailError);
                hasSentEmail.current = false;
              }
            }
          }
        } else if (response.payment_status === 'failed') {
          const pendingOrderId = localStorage.getItem('pendingVNPayOrder');
          if (pendingOrderId) {
            try {
              await orderService.cancelOrder(pendingOrderId);
              localStorage.removeItem('pendingVNPayOrder');
            } catch (error) {
              console.error('Error canceling order after failed payment:', error);
            }
          }
          
          setPaymentResult({ 
            success: false, 
            message: 'Thanh toán thất bại. Đơn hàng đã được hủy.' 
          });
          if (!hasShownToast.current) {
            showError('Thanh toán thất bại!');
            hasShownToast.current = true;
          }
        } else {
          setPaymentResult({ 
            success: false, 
            message: 'Trạng thái thanh toán không xác định. Vui lòng liên hệ hỗ trợ.' 
          });
        }
      } catch (error) {
        console.error('Error checking payment result:', error);
        setPaymentResult({ 
          success: false, 
          message: 'Có lỗi xảy ra khi kiểm tra kết quả thanh toán. Vui lòng thử lại.' 
        });
        if (!hasShownToast.current) {
          showError('Có lỗi xảy ra khi kiểm tra thanh toán!');
          hasShownToast.current = true;
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkPaymentResult();
  }, [searchParams, showSuccess, showError, addNotification, notifications]);

  return {
    isLoading,
    paymentResult,
    orderInfo
  };
};
