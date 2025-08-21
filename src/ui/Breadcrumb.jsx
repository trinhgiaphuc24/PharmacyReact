import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Breadcrumb = ({ items = [] }) => {
  return (
    <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span>/</span>}
          {item.link ? (
            <Link 
              to={item.link} 
              className="flex items-center gap-1 hover:text-green-700"
            >
              {index === 0 && <FaArrowLeft className="text-xs" />}
              {item.label}
            </Link>
          ) : (
            <span className="text-green-700 font-medium">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
