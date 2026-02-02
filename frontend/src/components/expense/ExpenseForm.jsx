import React, { useState, useRef } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { Select, SelectItem } from "../ui/Select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";

export const ExpenseForm = ({ members, onAddExpense }) => {
  const [payerId, setPayerId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toastShownRef = useRef(false);
  const canSubmit = members.length >= 2;

  const showToastOnce = (type, message, id) => {
    if (toastShownRef.current) return;

    toast[type](
      (t) => (
        <div className="relative pl-6">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="absolute left-0 top-0 text-gray-500 hover:text-red-500"
          >
            ✕
          </button>
          {message}
        </div>
      ),
      { id }
    );

    toastShownRef.current = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!canSubmit) {
      showToastOnce(
        "error",
        "Add at least 2 members to record an expense ❌",
        "expense-members"
      );
      return;
    }

    if (!payerId || !amount || !description) {
      showToastOnce(
        "error",
        "Please fill in all fields ⚠️",
        "expense-fields"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      await onAddExpense(payerId, parseFloat(amount), description);
      showToastOnce("success", "Expense recorded successfully 💸", "expense-added");

      setAmount("");
      setDescription("");
    } catch {
      showToastOnce("error", "Failed to record expense ❌", "expense-failed");
    } finally {
      setIsSubmitting(false);
      toastShownRef.current = false;
    }
  };

  return (
    <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-linear-to-br from-white to-blue-50">
      
      {/* 🌈 HEADER */}
      <CardHeader className="bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 text-white">
        <CardTitle className="text-xl font-bold tracking-wide">
          💳 Add New Expense
        </CardTitle>
        <p className="text-sm opacity-90">
          Split expenses easily with your group
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* 👤 PAYER */}
          <div className="space-y-1">
            <Label className="text-gray-700 font-medium">Payer</Label>
            <Select
              value={payerId}
              onChange={setPayerId}
              disabled={!canSubmit}
              className="focus:ring-2 focus:ring-indigo-400"
            >
              <SelectItem value="">Select payer</SelectItem>
              {members.map((member) => (
                <SelectItem key={member._id} value={member._id}>
                  {member.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* 💰 AMOUNT */}
          <div className="space-y-1">
            <Label className="text-gray-700 font-medium">Amount (₹)</Label>
            <Input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="e.g., 60.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!canSubmit}
              className="focus:ring-2 focus:ring-green-400"
            />
          </div>

          {/* 📝 DESCRIPTION */}
          <div className="space-y-1">
            <Label className="text-gray-700 font-medium">Description</Label>
            <Input
              type="text"
              placeholder="Dinner, Fuel, Stay..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={!canSubmit}
              className="focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* 🚀 SUBMIT BUTTON */}
          <Button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            className="w-full py-3 text-lg font-semibold rounded-xl 
              bg-linear-to-r from-indigo-500 to-green-500 
              hover:from-green-600 hover:to-green-600
              transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? "Recording..." : "💸 Record Expense"}
          </Button>

          {!canSubmit && (
            <p className="text-sm text-red-500 text-center mt-2 animate-pulse">
              ⚠️ Add at least 2 members to record an expense
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
