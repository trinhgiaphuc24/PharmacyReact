import React, { useState, useEffect } from "react";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "../features/Auth/LoginForm";
import AuthImagePanel from "../features/Auth/AuthImagePanel";
import LoadingSpinner from "../ui/LoadingSpinner";

const Login = () => {
  const [pageLoading, setPageLoading] = useState(true);
  const { formData, isLoading, handleInputChange, handleSubmit } = useLogin();

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
        <LoginForm 
          formData={formData}
          isLoading={isLoading}
          onInputChange={handleInputChange}
          onSubmit={handleSubmit}
        />
        <AuthImagePanel />
      </div>
    </div>
  );
};

export default Login;
