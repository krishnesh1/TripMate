import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft, KeyRound } from "lucide-react";
import { authAPI } from "../api/api";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const verify = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);
      await authAPI.verifyOTP(email, otp);
      toast.success("OTP verified");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    try {
      setResendLoading(true);
      await authAPI.forgotPassword(email);
      toast.success("OTP resent");
      setTimer(30);
    } catch {
      toast.error("Failed to resend");
    } finally {
      setResendLoading(false);
    }
  };

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
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <KeyRound className="h-5 w-5" />
          </span>
          <h1 className="text-2xl font-bold text-slate-950">Verify OTP</h1>
          <p className="mt-2 text-sm text-slate-500">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <input
          type="text"
          inputMode="numeric"
          maxLength={6}
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-center text-lg tracking-[0.35em] text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />

        <button
          type="button"
          onClick={verify}
          disabled={loading}
          className="mt-4 min-h-12 w-full rounded-lg bg-emerald-600 px-5 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-5 text-center">
          {timer > 0 ? (
            <p className="text-sm text-slate-500">Resend OTP in {timer}s</p>
          ) : (
            <button
              type="button"
              onClick={resendOTP}
              disabled={resendLoading}
              className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 disabled:opacity-50"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
