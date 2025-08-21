import React from 'react';

const InputField = ({ 
  label, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  icon, 
  required = false,
  className = ""
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
          className="w-full outline-none bg-transparent" 
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
    </div>
  );
};

export default InputField;
