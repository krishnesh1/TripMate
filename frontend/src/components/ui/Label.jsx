import React from "react";

export const Label = ({ children, className = "" }) => {
  return <label className={`text-sm font-semibold text-slate-700 ${className}`}>{children}</label>;
};
