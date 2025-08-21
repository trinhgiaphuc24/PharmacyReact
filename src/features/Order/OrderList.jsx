import React from 'react';
import OrderCard from './OrderCard';

const OrderList = ({ orders, onCancel }) => {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard 
          key={order.id} 
          order={order} 
          onCancel={onCancel}
        />
      ))}
    </div>
  );
};

export default OrderList;
