import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { ReceiptText } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select, SelectItem } from "../ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const ExpenseForm = ({ members, onAddExpense }) => {
  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [excludedMemberIds, setExcludedMemberIds] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toastShownRef = useRef(false);
  const canSubmit = members.length >= 2;

  const showToastOnce = (type, message, id) => {
    if (toastShownRef.current) return;
    toast[type](message, { id });
    toastShownRef.current = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      showToastOnce("error", "Add at least 2 members to record an expense", "expense-members");
      return;
    }

    if (!payerId || !amount || !description) {
      showToastOnce("error", "Please fill in all fields", "expense-fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddExpense(payerId, parseFloat(amount), description, excludedMemberIds);
      showToastOnce("success", "Expense recorded", "expense-added");
      setAmount("");
      setDescription("");
      setExcludedMemberIds([]);
    } catch {
      showToastOnce("error", "Failed to record expense", "expense-failed");
    } finally {
      setIsSubmitting(false);
      toastShownRef.current = false;
    }
  };

  const toggleExcludedMember = (memberId) => {
    setExcludedMemberIds((currentIds) =>
      currentIds.includes(memberId)
        ? currentIds.filter((id) => id !== memberId)
        : [...currentIds, memberId],
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>Add Expense</CardTitle>
            <p className="mt-1 text-sm text-slate-500">
              Record a payment for this trip.
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
            <ReceiptText className="h-5 w-5" />
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Payer</Label>
            <Select value={payerId} onChange={setPayerId} disabled={!canSubmit}>
              <SelectItem value="">Select payer</SelectItem>
              {members.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  {member.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Amount (Rs)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g. 600"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={!canSubmit}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Description</Label>
              <Input
                type="text"
                placeholder="Dinner, fuel, stay"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!canSubmit}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <Label>Exclude from this split</Label>
              <p className="mt-1 text-xs text-slate-500">
                Select anyone who should not pay for this expense.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
              {members.map((member) => (
                <label
                  key={member._id}
                  className={`flex min-h-11 items-center gap-2 rounded-lg border px-3 text-sm transition ${
                    excludedMemberIds.includes(member._id)
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={excludedMemberIds.includes(member._id)}
                    onChange={() => toggleExcludedMember(member._id)}
                    disabled={!canSubmit}
                    className="h-4 w-4 shrink-0 accent-red-500"
                  />
                  <span className="min-w-0 truncate">{member.name}</span>
                </label>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
          >
            {isSubmitting ? "Recording..." : "Record Expense"}
          </Button>

          {!canSubmit && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-center text-sm font-medium text-amber-700">
              Add at least 2 members to record an expense.
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
