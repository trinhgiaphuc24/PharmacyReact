import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Header from './Header';
import Footer from './Footer';
import Base from './Base';

const UnauthenticatedView = ({ 
  icon: Icon, 
  title = "Vui lòng đăng nhập", 
  message = "Bạn cần đăng nhập để xem nội dung này",
  loginLink = "/login"
}) => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <Icon className="mx-auto text-6xl text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-600 mb-4">{title}</h2>
        <p className="text-gray-500 mb-6">{message}</p>
        <Link 
          to={loginLink} 
          className="inline-flex items-center gap-2 bg-green-700 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition"
        >
          Đăng nhập ngay
          <FaArrowRight />
        </Link>
      </div>
      <Footer />
      <Base />
    </div>
  );
};

export default UnauthenticatedView;
