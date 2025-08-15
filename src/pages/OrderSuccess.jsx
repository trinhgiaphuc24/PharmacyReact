import React, { useEffect, useRef } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../ui/Header";
import Footer from "../ui/Footer";
import Base from "../ui/Base";
import { FaCheckCircle, FaShoppingCart, FaClipboardList } from "react-icons/fa";
import { orderService } from "../services/orderService";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const hasSentEmail = useRef(false); // Prevent multiple email sends

  useEffect(() => {
    // Gửi email thông báo đặt hàng thành công cho COD
    const sendOrderEmail = async () => {
      if (orderId && !hasSentEmail.current) {
        // Kiểm tra xem đã gửi email cho order này chưa
        const emailSentKey = `email_sent_${orderId}`;
        const alreadySent = localStorage.getItem(emailSentKey);
        
        if (!alreadySent) {
          hasSentEmail.current = true; // Set flag immediately
          try {
            await orderService.sendOrderEmail(orderId);
            localStorage.setItem(emailSentKey, 'true'); // Mark as sent
            console.log('COD order success email sent successfully');
          } catch (emailError) {
            console.error('Failed to send COD order email:', emailError);
            hasSentEmail.current = false; // Reset flag on error to allow retry
          }
        }
      }
    };

    sendOrderEmail();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      
      <div className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <FaCheckCircle className="mx-auto text-6xl text-green-700 mb-6" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng và liên hệ với bạn sớm nhất.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/medicines" 
                className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                <FaShoppingCart />
                Tiếp tục mua sắm
              </Link>
              
              <Link 
                to={orderId ? `/order-detail/${orderId}` : "/orders"}
                className="inline-flex items-center gap-2 bg-white border-2 border-green-700 text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
              >
                <FaClipboardList />
                Theo dõi đơn hàng
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
      <Base />
    </div>
  );
};

export default OrderSuccess;
