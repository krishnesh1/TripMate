import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api/api";
import toast from "react-hot-toast";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email) return toast.error("Enter email");

    try {
      setLoading(true);

      await authAPI.forgotPassword(email);

      toast.success("OTP sent to email 📧");

      navigate("/verify-otp", { state: { email } });

    } catch (err) {
      toast.error(err.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-white">

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        <h2 className="text-2xl font-bold text-emerald-600 text-center mb-6">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl mb-4"
        />

        <button
          onClick={sendOTP}
          disabled={loading}
          className="w-full bg-emerald-500 text-white py-3 rounded-xl font-semibold hover:bg-emerald-600 disabled:opacity-50"
        >
          {loading ? "Sending OTP..." : "Send OTP"}
        </button>
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
