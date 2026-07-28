import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { tripsAPI, membersAPI, expensesAPI } from "../api/api";
import { MemberList } from "../components/expense/MemberList";
import { ExpenseForm } from "../components/expense/ExpenseForm";
import { ExpenseHistory } from "../components/expense/ExpenseHistory";
import { SettlementPlan } from "../components/expense/SettlementPlan";
import { calculateSettlement } from "../utils/calculations";
import {
  ArrowLeft,
  CalendarDays,
  IndianRupee,
  LogOut,
  MapPin,
  Plane,
  Plus,
  ReceiptText,
  Users,
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripName, setTripName] = useState("");
  const [showTripForm, setShowTripForm] = useState(false);
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    if (user) fetchTrips();
  }, [user]);

  useEffect(() => {
    if (selectedTrip?._id) {
      fetchMembers(selectedTrip._id);
      fetchExpenses(selectedTrip._id);
    } else {
      setMembers([]);
      setExpenses([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTrip]);

  const fetchTrips = async () => {
    const data = await tripsAPI.getAll();
    setTrips(Array.isArray(data) ? data : []);
  };

  const fetchMembers = async (tripId = selectedTrip?._id) => {
    if (!tripId) return;
    const data = await membersAPI.getAll(tripId);
    setMembers(Array.isArray(data) ? data : []);
  };

  const fetchExpenses = async (tripId = selectedTrip?._id) => {
    if (!tripId) return;
    const data = await expensesAPI.getAll(tripId);
    setExpenses(Array.isArray(data) ? data : []);
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();

    if (!tripName.trim()) {
      toast.error("Trip name cannot be empty");
      return;
    }

    setIsCreatingTrip(true);

    try {
      const trip = await tripsAPI.create(tripName.trim());
      setTrips((currentTrips) => [trip, ...currentTrips]);
      setSelectedTrip(trip);
      setTripName("");
      setShowTripForm(false);
      toast.success("Trip created");
    } catch (error) {
      toast.error(error.message || "Failed to create trip");
    } finally {
      setIsCreatingTrip(false);
    }
  };

  const handleAddMember = async (name) => {
    await membersAPI.create(name, selectedTrip._id);
    fetchMembers();
  };

  const handleRemoveMember = async (id) => {
    await membersAPI.delete(id);
    fetchMembers();
    fetchExpenses();
  };

  const handleAddExpense = async (payerId, amount, description, excludedMemberIds) => {
    await expensesAPI.create(
      payerId,
      amount,
      description,
      selectedTrip._id,
      excludedMemberIds,
    );
    fetchExpenses();
  };

  const handleResetExpenses = async () => {
    await expensesAPI.reset(selectedTrip._id);
    fetchExpenses();
  };

  const handleDeleteExpense = async (id) => {
    await expensesAPI.delete(id);
    fetchExpenses();
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const transactions = calculateSettlement(expenses, members);
  const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const renderHeader = () => (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-white shadow-sm">
            <img src="/logo.png" alt="TripMate Logo" className="h-8 w-8 object-contain" />
          </span>

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold text-slate-950 sm:text-2xl">
              TripMate
            </h1>
            <p className="truncate text-xs text-slate-500 sm:text-sm">
              Split group trips clearly
            </p>
          </div>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:justify-start">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{user?.name}</p>
            <p className="max-w-48 truncate text-xs text-slate-500 sm:max-w-64">{user?.email}</p>
          </div>

          <button
            onClick={handleLogout}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-red-50 hover:text-red-600"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );

  const renderTripHome = () => (
    <div className="min-h-screen bg-slate-50">
      {renderHeader()}

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
                <Plane className="h-4 w-4" />
                Trip workspace
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-bold text-slate-950 sm:text-4xl">
                Create a trip, then manage only that trip's members and expenses.
              </h2>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Keep Shimla, Manali, and every other group separate. Each trip has
                its own people, spending history, and settlement plan.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setShowTripForm((isVisible) => !isVisible)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Plus className="h-5 w-5" />
                  Create Trip
                </button>
              </div>

              {showTripForm && (
                <form
                  onSubmit={handleCreateTrip}
                  className="mt-5 grid gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 sm:grid-cols-[1fr_auto]"
                >
                  <input
                    value={tripName}
                    onChange={(e) => setTripName(e.target.value)}
                    placeholder="Trip name, e.g. Shimla"
                    className="min-h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                  />
                  <button
                    type="submit"
                    disabled={isCreatingTrip}
                    className="min-h-12 rounded-xl bg-slate-950 px-5 font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
                  >
                    {isCreatingTrip ? "Creating..." : "Save Trip"}
                  </button>
                </form>
              )}
            </div>

            <div className="border-t border-slate-200 bg-slate-950 p-5 text-white sm:p-8 lg:border-l lg:border-t-0 lg:p-10">
              <p className="text-sm font-medium text-emerald-300">Overview</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-3xl font-bold">{trips.length}</p>
                  <p className="mt-1 text-sm text-slate-300">Trips</p>
                </div>
                <div className="rounded-lg bg-white/10 p-4">
                  <p className="text-3xl font-bold">Private</p>
                  <p className="mt-1 text-sm text-slate-300">Per account</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-950">Your trips</h3>
          </div>

          {trips.length === 0 && !showTripForm ? (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white py-16 text-center text-slate-500">
              <Plane className="mx-auto mb-3 h-10 w-10 text-emerald-500" />
              <p className="font-medium">No trips yet</p>
              <p className="mt-1 text-sm">Create your first trip to start splitting.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {trips.map((trip) => (
                <button
                  key={trip._id}
                  onClick={() => setSelectedTrip(trip)}
                  className="group min-h-32 rounded-lg border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                      <MapPin className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Open
                    </span>
                  </div>

                  <p className="mt-5 break-words text-xl font-bold text-slate-950">
                    {trip.name}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    View members, expenses, and settlement.
                  </p>
                </button>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );

  const renderStat = (label, value, icon) => {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-500">{label}</p>
            <p className="truncate text-xl font-bold text-slate-950">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const renderTripDashboard = () => (
    <div className="min-h-screen bg-slate-50">
      {renderHeader()}

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="mb-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <button
                onClick={() => setSelectedTrip(null)}
                className="mb-3 inline-flex items-center gap-2 rounded-lg px-1 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
              >
                <ArrowLeft className="h-4 w-4" />
                All trips
              </button>

              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <MapPin className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h2 className="break-words text-2xl font-bold text-slate-950 sm:text-3xl">
                    {selectedTrip.name}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage this trip's members and expense split.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[520px]">
              {renderStat("Members", members.length, <Users className="h-5 w-5" />)}
              {renderStat("Expenses", expenses.length, <ReceiptText className="h-5 w-5" />)}
              {renderStat("Total", `Rs ${totalSpent.toFixed(2)}`, <IndianRupee className="h-5 w-5" />)}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(320px,420px)_1fr]">
          <div className="space-y-5">
            <ExpenseForm members={members} onAddExpense={handleAddExpense} />
            <MemberList
              members={members}
              onAddMember={handleAddMember}
              onRemoveMember={handleRemoveMember}
            />
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-5">
            <SettlementPlan transactions={transactions} />
            <ExpenseHistory
              expenses={expenses}
              members={members}
              onResetExpenses={handleResetExpenses}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>
        </section>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
          <CalendarDays className="h-4 w-4" />
          <span>Updated when members or expenses change</span>
        </div>
      </main>
    </div>
  );

  return selectedTrip ? renderTripDashboard() : renderTripHome();
};

export default Index;
