import React from "react"
export const Card = ({ children }) => {
  return <div className="bg-white shadow rounded-lg p-4">{children}</div>;
};

export const CardHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-xl font-bold">{children}</h2>
);

export const CardContent = ({ children }) => <div>{children}</div>;
