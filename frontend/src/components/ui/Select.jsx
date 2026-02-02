import React from "react"

export const Select = ({ children, value, onChange }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-2 border rounded"
    >
      {children}
    </select>
  );
};

export const SelectItem = ({ value, children }) => {
  return <option value={value}>{children}</option>;
};
