import React, { useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const ExpenseHistory = ({ expenses, members, onResetExpenses }) => {
  const toastRef = useRef(false);

  const getMemberName = (payerId) => {
    const member = members.find((m) => m._id === payerId);
    return member?.name || "Unknown";
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const handleReset = () => {
    if (toastRef.current) return;
    toastRef.current = true;

    toast(
      (t) => (
        <div className="relative space-y-3 pl-6">
          {/* ❌ CLOSE */}
          <button
            onClick={() => {
              toast.dismiss(t.id);
              toastRef.current = false;
            }}
            className="absolute left-0 top-0 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>

          <p className="font-semibold text-gray-800">Reset all expenses?</p>

          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => {
                toast.dismiss(t.id);
                toastRef.current = false;
              }}
            >
              Cancel
            </button>

            <button
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              onClick={async () => {
                toast.dismiss(t.id);
                await onResetExpenses();

                toast.success(
                  (t2) => (
                    <div className="relative pl-6">
                      <button
                        onClick={() => toast.dismiss(t2.id)}
                        className="absolute left-0 top-0 text-gray-500 hover:text-red-500"
                      >
                        ✕
                      </button>
                      All expenses reset successfully 🔄
                    </div>
                  ),
                  { id: "expense-reset" },
                );

                toastRef.current = false;
              }}
            >
              Reset
            </button>
          </div>
        </div>
      ),
      { duration: 6000, id: "reset-confirm" },
    );
  };

  return (
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-linear-to-br from-white to-rose-50">
      {/* 🌈 HEADER */}
      <CardHeader className="bg-linear-to-r from-rose-500 via-pink-500 to-purple-500 text-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold tracking-wide">
              📜 Expense History
            </CardTitle>
            <p className="text-sm opacity-90">Recent expenses appear first</p>
          </div>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleReset}
            disabled={expenses.length === 0}
            className="bg-linear-to-r from-indigo-500 to-green-500 hover:from-green-600 hover:to-green-600 transition-all duration-300 text-white font-semibold px-3 py-1.5 shadow-md hover:shadow-lg"
          >
            Reset All
          </Button>
        </div>
      </CardHeader>

      {/* 🧾 CONTENT */}
      <CardContent className="p-5">
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {sortedExpenses.length === 0 ? (
            <div className="text-center py-10 text-gray-500 italic">
              No expenses recorded yet 💭
            </div>
          ) : (
            sortedExpenses.map((expense) => (
              <div
                key={expense._id}
                className="p-4 rounded-xl bg-white shadow-md hover:shadow-lg transition-all border-l-4 border-pink-400"
              >
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">
                    {getMemberName(expense.payerId)}
                  </p>
                  <span className="text-green-600 font-bold text-lg">
                    ₹{expense.amount.toFixed(2)}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mt-1">
                  {expense.description}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(expense.createdAt).toLocaleString()}
                </p>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};
