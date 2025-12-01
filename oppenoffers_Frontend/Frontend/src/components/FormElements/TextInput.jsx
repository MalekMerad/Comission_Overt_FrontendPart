import React from 'react';
import './../../../styles/componentsStyles/TextInput.css';

const TextInput = ({ label, name, value, onChange, placeholder, type = 'text', required = false }) => {
  return (
    <div className="form-group">
      {label && <label htmlFor={name}>{label}</label>}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="text-input"
      />
    </div>
  );
};

export default TextInput;
