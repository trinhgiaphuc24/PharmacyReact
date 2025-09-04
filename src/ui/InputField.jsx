import React from 'react';

const InputField = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon, 
  required = false,
  className = "",
  disabled = false,
  error = "",
  name
}) => {
  return (
    <div className={className}>
      <label className="block text-gray-700 mb-1">{label}</label>
      <div className="flex items-center border-b border-gray-300 py-2">
        {icon && (
          <span className="text-green-700 mr-2">
            {icon}
          </span>
        )}
        <input 
          type={type}
          name={name}
          className={`w-full outline-none bg-transparent ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
        />
      </div>
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputField;
