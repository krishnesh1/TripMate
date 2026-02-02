import React from "react"

export const Button = ({ children, className = "", ...props }) => {
  return (
    <button
      className={`px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
