import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { authAPI } from "../api/api";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const reset = async () => {
    if (!password || !confirm) return toast.error("All fields required");
    if (password !== confirm) return toast.error("Passwords do not match");

    try {
      setLoading(true);
      await authAPI.resetPassword(email, password);
      toast.success("Password reset successful");
      setTimeout(() => navigate("/auth"), 1000);
    } catch (err) {
      toast.error(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "min-h-12 w-full rounded-lg border border-slate-200 bg-white px-11 pr-12 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-6">
      <section className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
        <button
          type="button"
          onClick={() => navigate("/auth")}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-950">Reset Password</h1>
          <p className="mt-2 text-sm text-slate-500">
            Create a new password for your account.
          </p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">New Password</span>
            <span className="relative mt-1 block">
              <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-slate-700">Confirm Password</span>
            <span className="relative mt-1 block">
              <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </span>
          </label>

          <button
            type="button"
            onClick={reset}
            disabled={loading}
            className="min-h-12 w-full rounded-lg bg-emerald-600 px-5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </div>
      </section>
    </main>
  );
}
