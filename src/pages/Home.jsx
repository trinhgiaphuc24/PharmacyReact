
import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Header from '../ui/Header';
import MedicineGenre from '../features/MedicineGenre/MedicineGenre';
import HomeMedicineList from '../features/Medicine/HomeMedicineList';
import Footer from '../ui/Footer';
import Base from '../ui/Base';
import LoadingSpinner from '../ui/LoadingSpinner';
import { useBestSellingMedicines } from '../hooks/useBestSellingMedicines';


const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // Fetch best selling medicines
  const { bestSellingMedicines, loading: medicinesLoading, error } = useBestSellingMedicines();

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (loading || medicinesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner message="Đang tải trang chủ..." />
      </div>
    );
  }

  if (error) {
    console.error('Error loading best selling medicines:', error);
  }

  return (
    <div className="min-h-screen bg-white-50 font-sans">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} cartCount={cartCount} />
      {/* Main Content */}
      <div className="py-8 p-20">
        <div className="max-w-6xl mx-auto px-20">
          <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Promo Banner */}
              <div className="rounded-xl overflow-hidden">
                <Carousel
                  autoPlay
                  infiniteLoop
                  showThumbs={false}
                  showStatus={false}
                  interval={3000}
                  stopOnHover
                  transitionTime={600}
                  className="rounded-xl"
                >
                  <div>
                    <img
                      src="https://prod-cdn.pharmacity.io/e-com/images/landing-pages/20250626062824-0-1200x500.png?versionId=I1NVBeHRIOP5vO2o08KfKhaUe.OJoCYX"
                      alt="Banner 1"
                    />
                  </div>
                  <div>
                    <img
                      src="https://prod-cdn.pharmacity.io/e-com/images/landing-pages/20250709045616-0-LPDesktop.png?versionId=EA5LbhykuPpUsbvSYQgztxOqS0vwpz9Z"
                      alt="Banner 2"
                    />
                  </div>
                  <div>
                    <img
                      src="https://prod-cdn.pharmacity.io/e-com/images/landing-pages/20250627071033-0-LPDesktop.png?versionId=hAVHLY5FYQ7g1vphTdyAirznTVC3YQa."
                      alt="Banner 3"
                    />
                  </div>
                </Carousel>
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="lg:col-span-3 flex flex-col gap-6 justify-between h-full">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">
                <img
                  src="https://production-cdn.pharmacity.io/digital/778x0/plain/e-com/images/banners/20250513024810-0-389x143-sub.png?versionId=BXtOBlz3nxYP6iHcXjIhDq5qMmuBK1ku"
                  alt="Promo Banner"
                  className="h-[126px] w-full object-cover h-auto rounded-lg mb-4"
                />
              </div>
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-xl shadow-lg">
                <img
                  src="https://production-cdn.pharmacity.io/digital/778x0/plain/e-com/images/banners/20250624063333-0-pmce-energy.png?versionId=d9JP6ORjZc5p1LPJYPB8bB4S41TgRFKy"
                  alt="Promo Banner"
                  className="h-[126px] w-full object-cover h-auto rounded-lg mb-4"
                />
              </div>
            </div>
          </div>
          {/* MedicineGenre */}
          <MedicineGenre />
          {/* Medicine Grid Section */}
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Thuốc bán chạy</h2>
          {error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : (
            <HomeMedicineList medicines={bestSellingMedicines} />
          )}
        </div>
      </div>
      {/* Footer */}
      <Footer />
      <Base />
    </div>
  );
};

export default Home;
