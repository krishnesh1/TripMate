import React from "react"

export const Input = (props) => {
  return (
    <input
      {...props}
      className="w-full p-2 border rounded focus:ring-2 focus:ring-indigo-500"
    />
  );
};
