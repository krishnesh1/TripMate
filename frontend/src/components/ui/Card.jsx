import React from "react";

export const Card = ({ children, className = "" }) => {
  return (
    <div className={`overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "" }) => (
  <div className={`border-b border-slate-100 p-4 sm:p-5 ${className}`}>{children}</div>
);

export const CardTitle = ({ children, className = "" }) => (
  <h2 className={`text-lg font-bold text-slate-950 ${className}`}>{children}</h2>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 sm:p-5 ${className}`}>{children}</div>
);
