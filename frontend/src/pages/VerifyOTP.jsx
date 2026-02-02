import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authAPI } from "../api/api";
import toast from "react-hot-toast";

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(30);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // ⏳ Countdown Timer
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ✅ Verify OTP
  const verify = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);

      await authAPI.verifyOTP(email, otp);

      toast.success("OTP verified ✅");

      navigate("/reset-password", { state: { email } });

    } catch (err) {
      toast.error(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Resend OTP
  const resendOTP = async () => {
    try {
      setResendLoading(true);

      await authAPI.forgotPassword(email);

      toast.success("OTP resent 📧");

      setTimer(30);

    } catch (err) {
      toast.error("Failed to resend");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-rose-50 px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

        {/* BACK TO LOGIN */}
        <button
          onClick={() => navigate("/auth")}
          className="text-emerald-600 text-sm mb-4 hover:underline"
        >
          ← Back to Login
        </button>

        <h2 className="text-2xl font-bold text-emerald-600 text-center mb-2">
          Verify OTP 🔑
        </h2>

        <p className="text-gray-500 text-center mb-6">
          Enter OTP sent to your email
        </p>

        <input
          type="text"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          onChange={(e) => setOtp(e.target.value)}
          className="w-full text-center tracking-widest px-4 py-3 border rounded-xl mb-4 focus:ring-2 focus:ring-emerald-400 outline-none"
        />

        {/* VERIFY BUTTON */}
        <button
          onClick={verify}
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* RESEND */}
        <div className="text-center mt-4">
          {timer > 0 ? (
            <p className="text-gray-500 text-sm">
              Resend OTP in {timer}s
            </p>
          ) : (
            <button
              onClick={resendOTP}
              disabled={resendLoading}
              className="text-emerald-600 font-medium hover:underline"
            >
              {resendLoading ? "Sending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {/* LOGIN OPTION */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Remember your password?{" "}
          <span
            onClick={() => navigate("/auth")}
            className="text-emerald-600 font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}
