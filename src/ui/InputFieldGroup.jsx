import React from 'react';
import InputField from './InputField';

const InputFieldGroup = ({ fields, gridCols = 2, className = "" }) => {
  return (
    <div className={`grid grid-cols-${gridCols} gap-4 ${className}`}>
      {fields.map((field, index) => (
        <InputField
          key={index}
          label={field.label}
          type={field.type || "text"}
          placeholder={field.placeholder}
          value={field.value}
          onChange={field.onChange}
          icon={field.icon}
          required={field.required}
        />
      ))}
    </div>
  );
};

export default InputFieldGroup;
