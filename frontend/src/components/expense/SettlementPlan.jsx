import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const SettlementPlan = ({ transactions }) => {
  const toastRef = useRef(false);

  useEffect(() => {
    if (transactions.length === 0 && !toastRef.current) {
      toast(
        (t) => (
          <div className="relative pl-6">
            <button
              onClick={() => {
                toast.dismiss(t.id);
                toastRef.current = false;
              }}
              className="absolute left-0 top-0 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
            Add expenses to generate a settlement plan 💡
          </div>
        ),
        { id: "settlement-info" }
      );
      toastRef.current = true;
    }

    if (transactions.length > 0) {
      toastRef.current = false;
    }
  }, [transactions.length]);

  return (
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-linear-to-br from-white to-emerald-50">

      {/* 🌈 HEADER */}
      <CardHeader className="bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white">
        <CardTitle className="text-xl font-bold tracking-wide">
          🤝 Settlement Plan
        </CardTitle>
        <p className="text-sm opacity-90">
          Optimized payments to settle up fairly
        </p>
      </CardHeader>

      {/* 📊 CONTENT */}
      <CardContent className="p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 italic">
            No settlements yet 💭
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((t, i) => (
              <div
                key={i}
                className="
                  flex justify-between items-center
                  p-4 rounded-xl
                  bg-white shadow-md
                  hover:shadow-lg transition-all
                  border-l-4 border-emerald-400
                "
              >
                <div className="text-sm sm:text-base">
                  <span className="font-semibold text-red-500">
                    {t.debtorName}
                  </span>{" "}
                  <span className="text-gray-500">pay to</span>{" "}
                  <span className="font-semibold text-green-600">
                    {t.creditorName}
                  </span>
                </div>

                <span className="font-bold text-green-600">
                  ₹{t.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
