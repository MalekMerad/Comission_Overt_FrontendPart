import React from 'react';

const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  error,
  className = '',
  ...rest
}) => {
  return (
    <div className={`mb-5 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className="block mb-2 text-sm font-medium text-gray-700 font-['Segoe_UI']"
        >
          {label}
          {required && <span className="text-red-500 ml-1"></span>}
        </label>
      )}
      
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : ''} font-segoe`}
        {...rest}
      />
      
      {error && (
        <p className="mt-1.5 text-xs text-red-600 font-['Segoe_UI']">
          {error}
        </p>
      )}
    </div>
  );
};

export default TextInput;