import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email) return toast.error("Enter email");

    try {
      setLoading(true);
      await authAPI.forgotPassword(email);
      toast.success("OTP sent to email");
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 to-white px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-emerald-600">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 min-h-12 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <button
          type="button"
          onClick={sendOTP}
          disabled={loading}
          className="min-h-12 w-full rounded-xl bg-emerald-500 py-3 font-semibold text-white hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <button
            type="button"
            onClick={() => navigate("/auth")}
            className="font-medium text-emerald-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
