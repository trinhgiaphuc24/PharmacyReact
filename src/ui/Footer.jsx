import React from "react";

const Footer = () => (
  <footer className="bg-gray-100 text-gray-700 mt-10 pt-10 pb-5 border-t px-20">
    <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 text-sm">
      {/* Về Pharmacy */}
      <div>
        <h3 className="font-semibold mb-2">Về Pharmacy</h3>
        <ul className="space-y-1">
          <li>Giới thiệu</li>
          <li>Hệ thống cửa hàng</li>
          <li>Giấy phép kinh doanh</li>
          <li>Chính sách trả và bảo hành</li>
          <li>Chính sách giao hàng</li>
          <li>Chính sách bảo mật</li>
          <li>Câu hỏi thường gặp</li>
        </ul>
      </div>
      {/* Danh mục */}
      <div>
        <h3 className="font-semibold mb-2">Danh mục</h3>
        <ul className="space-y-1">
          <li>Thuốc</li>
          <li>Tra cứu bệnh</li>
          <li>Thực phẩm bảo vệ sức khỏe</li>
          <li>Chăm sóc cá nhân</li>
          <li>Mẹ và Bé</li>
          <li>Thiết bị y tế</li>
          <li>Góc sức khỏe</li>
        </ul>
      </div>
      {/* Tổng đài */}
      <div>
        <h3 className="font-semibold mb-2">Tổng đài miễn cước</h3>
        <ul className="space-y-1">
          <li>Đặt hàng: <strong className="text-green-600">1800 6821</strong></li>
          <li>Thông tin thuốc: <strong className="text-green-600">1800 6821</strong></li>
          <li>Góp ý: <strong className="text-green-600">1800 6821</strong></li>
        </ul>
      </div>
      {/* Mạng xã hội & app */}
      <div>
        <h3 className="font-semibold mb-2">Theo dõi chúng tôi</h3>
        <div className="flex gap-2 mb-3">
          <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="w-6 h-6" />
          <img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" alt="YouTube" className="w-6 h-6" />
          <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" alt="Zalo" className="w-6 h-6" />
        </div>
      </div>
    </div>
    <div className="mt-10 text-center text-xs text-gray-500">
      <p>Công ty Cổ phần Dược Phẩm Gia Phúc. Địa chỉ: 123 Đường ABC, Quận 1, TP.HCM. MST: 123456789</p>
      <p>© 2025 Gia Phúc Pharmacy. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
