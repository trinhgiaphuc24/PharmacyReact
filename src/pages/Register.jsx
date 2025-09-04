import React, { useState, useEffect } from "react";
import { useRegister } from "../hooks/useRegister";
import RegisterForm from "../features/Auth/RegisterForm";
import AuthImagePanel from "../features/Auth/AuthImagePanel";
import LoadingSpinner from "../ui/LoadingSpinner";

const Register = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const { formData, isLoading, handleInputChange, handleSubmit } = useRegister();

  useEffect(() => {
    // Simulate page loading time
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-700">
        <LoadingSpinner message="" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-700">
      <div className="bg-white rounded-xl shadow-lg flex w-full max-w-4xl overflow-hidden">
        <RegisterForm 
          formData={formData}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        <AuthImagePanel 
          imageUrl="https://images.pexels.com/photos/7615574/pexels-photo-7615574.jpeg"
          alt="Pharmacy background"
          overlayOpacity={0}
        />
      </div>
    </div>
  );
};

export default Register;
