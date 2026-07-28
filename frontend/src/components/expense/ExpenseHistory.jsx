import React, { useRef } from "react";
import toast from "react-hot-toast";
import { Clock3, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const ExpenseHistory = ({ expenses, members, onResetExpenses, onDeleteExpense }) => {
  const toastRef = useRef(false);

  const getMemberName = (payerId) => {
    const member = members.find((m) => m._id === payerId);
    return member?.name || "Unknown";
  };

  const getExcludedNames = (excludedMemberIds = []) => {
    return excludedMemberIds
      .map((memberId) => getMemberName(memberId))
      .filter((name) => name !== "Unknown");
  };

  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  const handleReset = () => {
    if (toastRef.current) return;
    toastRef.current = true;

    toast(
      (t) => (
        <div className="space-y-3">
          <p className="font-semibold text-slate-900">Reset all expenses for this trip?</p>

          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              onClick={() => {
                toast.dismiss(t.id);
                toastRef.current = false;
              }}
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              onClick={async () => {
                toast.dismiss(t.id);
                await onResetExpenses();
                toast.success("Expenses reset", { id: "expense-reset" });
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

  const handleDeleteExpense = (expense) => {
    if (toastRef.current) return;
    toastRef.current = true;

    toast(
      (t) => (
        <div className="space-y-3">
          <p className="font-semibold text-slate-900">Delete this expense?</p>
          <p className="text-sm text-slate-500">
            {expense.description} - Rs {Number(expense.amount).toFixed(2)}
          </p>

          <div className="flex justify-end gap-2">
            <button
              className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-200"
              onClick={() => {
                toast.dismiss(t.id);
                toastRef.current = false;
              }}
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-red-700"
              onClick={async () => {
                toast.dismiss(t.id);
                await onDeleteExpense(expense._id);
                toast.success("Expense deleted", { id: "expense-deleted" });
                toastRef.current = false;
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: 6000, id: "delete-expense-confirm" },
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <Clock3 className="h-5 w-5" />
            </span>
            <div>
              <CardTitle>Expense History</CardTitle>
              <p className="mt-1 text-sm text-slate-500">Recent expenses appear first.</p>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleReset}
            disabled={expenses.length === 0}
            className="w-full bg-slate-100 text-slate-700 hover:bg-red-50 hover:text-red-700 sm:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset All
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="max-h-[28rem] space-y-3 overflow-y-auto pr-1">
          {sortedExpenses.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
              No expenses recorded yet.
            </div>
          ) : (
            sortedExpenses.map((expense) => {
              const excludedNames = getExcludedNames(expense.excludedMemberIds);

              return (
                <div
                  key={expense._id}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">
                        {getMemberName(expense.payerId)}
                      </p>
                      <p className="mt-1 break-words text-sm text-slate-500">
                        {expense.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
                        Rs {Number(expense.amount).toFixed(2)}
                      </span>
                      <Button
                        type="button"
                        onClick={() => handleDeleteExpense(expense)}
                        className="h-10 min-h-10 w-10 bg-red-50 p-0 text-red-600 hover:bg-red-100"
                        aria-label={`Delete ${expense.description}`}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  {excludedNames.length > 0 && (
                    <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
                      Excluded: {excludedNames.join(", ")}
                    </p>
                  )}

                  <p className="mt-3 text-xs text-slate-400">
                    {new Date(expense.createdAt).toLocaleString()}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};
