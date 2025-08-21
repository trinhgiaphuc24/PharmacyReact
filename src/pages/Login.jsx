import React from "react";
import { useLogin } from "../hooks/useLogin";
import LoginForm from "../features/Auth/LoginForm";
import AuthImagePanel from "../features/Auth/AuthImagePanel";

const Login = () => {
  const { formData, isLoading, handleInputChange, handleSubmit } = useLogin();

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
