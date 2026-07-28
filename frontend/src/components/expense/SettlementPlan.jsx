import React, { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { ArrowRightLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const SettlementPlan = ({ transactions }) => {
  const toastRef = useRef(false);

  useEffect(() => {
    if (transactions.length === 0 && !toastRef.current) {
      toast("Add expenses to generate a settlement plan", { id: "settlement-info" });
      toastRef.current = true;
    }

    if (transactions.length > 0) {
      toastRef.current = false;
    }
  }, [transactions.length]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Settlement Plan</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Payments needed to settle this trip.
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <ArrowRightLeft className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>

      <CardContent>
        {transactions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            No settlements yet.
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div
                key={`${transaction.debtorId}-${transaction.creditorId}-${index}`}
                className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <div className="min-w-0 text-sm sm:text-base">
                  <span className="font-bold text-red-600">{transaction.debtorName}</span>
                  <span className="text-slate-500"> pays </span>
                  <span className="font-bold text-emerald-700">{transaction.creditorName}</span>
                </div>

                <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                  Rs {transaction.amount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
