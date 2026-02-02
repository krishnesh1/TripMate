import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { membersAPI, expensesAPI } from "../api/api";
import { MemberList } from "../components/expense/MemberList";
import { ExpenseForm } from "../components/expense/ExpenseForm";
import { ExpenseHistory } from "../components/expense/ExpenseHistory";
import { SettlementPlan } from "../components/expense/SettlementPlan";
import { calculateSettlement } from "../utils/calculations";
import { LogOut, User, Plane } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (user) {
      fetchMembers();
      fetchExpenses();
    }
  }, [user]);

  const fetchMembers = async () => {
    const data = await membersAPI.getAll();
    setMembers(data);
  };

  const fetchExpenses = async () => {
    const data = await expensesAPI.getAll();
    setExpenses(data);
  };

  const handleAddMember = async (name) => {
    await membersAPI.create(name);
    fetchMembers();
  };

  const handleRemoveMember = async (id) => {
    await membersAPI.delete(id);
    fetchMembers();
    fetchExpenses();
  };

  const handleAddExpense = async (payerId, amount, description) => {
    await expensesAPI.create(payerId, amount, description);
    fetchExpenses();
  };

  const handleResetExpenses = async () => {
    await expensesAPI.reset();
    fetchExpenses();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const transactions = calculateSettlement(expenses, members);

  return (
    /* 🌈 FULL SCREEN BACKGROUND */
    <div className="min-h-screen w-full bg-linear-to-br from-emerald-50 via-white to-rose-50">
      {/* CONTENT WRAPPER */}
      <div className="min-h-screen p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* 🔹 TOP BAR */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white shadow">
                <img
                  src="/logo.png"
                  alt="TripMate Logo"
                  className="h-8 w-8 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-emerald-600">
                  TripMate
                </h1>
                <p className="text-sm text-gray-500">
                  Split expenses the smart way
                </p>
              </div>
            </div>

            {/* 👤 USER CARD */}
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow">
              <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center">
                <User className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-2 text-gray-400 hover:text-red-500 transition"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* 🔹 MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ADD EXPENSE */}
            <div className="bg-white rounded-2xl shadow p-6">
              <h2 className="text-lg font-semibold mb-1">Add Expense</h2>
              <p className="text-sm text-gray-500 mb-4">Record a new payment</p>
              <ExpenseForm members={members} onAddExpense={handleAddExpense} />
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-2 space-y-6">
              {/* MEMBERS */}
              <div className="bg-white rounded-2xl shadow p-6">
                <MemberList
                  members={members}
                  onAddMember={handleAddMember}
                  onRemoveMember={handleRemoveMember}
                />
              </div>

              {/* SETTLEMENT */}
              <div className="bg-white rounded-2xl shadow p-6">
                <SettlementPlan transactions={transactions} />
              </div>

              {/* HISTORY */}
              <div className="bg-white rounded-2xl shadow p-6">
                <ExpenseHistory
                  expenses={expenses}
                  members={members}
                  onResetExpenses={handleResetExpenses}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 🔻 PREMIUM FOOTER */}
      {/* 🔻 PREMIUM FOOTER */}
      <footer className="mt-20 bg-linear-to-br from-white to-emerald-50 border-t">
        {/* TOP GLOW LINE */}
        <div className="h-1 w-full bg-linear-to-r from-emerald-400 via-emerald-500 to-rose-400"></div>

        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* TOP SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            {/* LEFT — LOGO + TEXT */}
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="TripMate Logo"
                  className="h-12 w-12 object-contain drop-shadow-md"
                />

                <h2 className="font-bold text-2xl text-emerald-600">
                  TripMate
                </h2>
              </div>

              <p className="text-gray-500 mt-3 max-w-xs">
                Making group expense splitting simple, fair and stress-free ✈️
              </p>
            </div>

            {/* RIGHT — CONTACT CARD */}
            <div className="bg-white shadow-md px-8 py-5 rounded-2xl text-center hover:shadow-lg transition">
              <p className="text-sm text-gray-500 mb-1">Contact Support</p>

              <a
                href="mailto:tripmate.apps@gmail.com"
                className="text-emerald-600 font-semibold hover:underline text-lg"
              >
                tripmate.apps@gmail.com
              </a>

              <p className="text-xs text-gray-400 mt-2">
                We reply within 24 hours 🚀
              </p>
            </div>
          </div>

          {/* BOTTOM SECTION */}
          <div className="mt-12 pt-6 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© {new Date().getFullYear()} TripMate. All rights reserved.</p>

            <p className="font-medium">
              developed by{" "}
              <span className="text-emerald-600">Krishnesh</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
