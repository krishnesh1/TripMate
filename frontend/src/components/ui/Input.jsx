import React from "react";

export const Input = ({ className = "", ...props }) => {
  return (
    <input
      {...props}
      className={`min-h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 ${className}`}
    />
  );
};
