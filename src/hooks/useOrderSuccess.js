import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { orderService } from '../services/orderService';

export const useOrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const hasSentEmail = useRef(false);

  useEffect(() => {
    const sendOrderEmail = async () => {
      if (orderId && !hasSentEmail.current) {
        const emailSentKey = `email_sent_${orderId}`;
        const alreadySent = localStorage.getItem(emailSentKey);
        
        if (!alreadySent) {
          hasSentEmail.current = true;
          try {
            await orderService.sendOrderEmail(orderId);
            localStorage.setItem(emailSentKey, 'true');
            console.log('COD order success email sent successfully');
          } catch (emailError) {
            console.error('Failed to send COD order email:', emailError);
            hasSentEmail.current = false;
          }
        }
      }
    };

    sendOrderEmail();
  }, [orderId]);

  return {
    orderId
  };
};
