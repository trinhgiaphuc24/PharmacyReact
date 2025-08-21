import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const EmptyState = ({ 
  icon: Icon, 
  title, 
  description, 
  actionText, 
  actionLink 
}) => {
  return (
    <div className="text-center py-16">
      <Icon className="mx-auto text-6xl text-gray-300 mb-4" />
      <h2 className="text-2xl font-bold text-gray-600 mb-4">{title}</h2>
      <p className="text-gray-500 mb-8">{description}</p>
      
      {actionText && actionLink && (
        <Link 
          to={actionLink} 
          className="inline-flex items-center gap-2 bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition"
        >
          {actionText}
          <FaArrowRight />
        </Link>
      )}
    </div>
  );
};

export default EmptyState;
