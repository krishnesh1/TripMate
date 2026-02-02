import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { authAPI } from "../api/api";
import toast from "react-hot-toast";

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
    if (!password || !confirm)
      return toast.error("All fields required");

    if (password !== confirm)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);

      // ✅ No OTP here
      await authAPI.resetPassword(email, password);

      toast.success("Password reset successful 🎉");

      setTimeout(() => navigate("/auth"), 1500);

    } catch (err) {
      toast.error(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-rose-50 px-4">

      <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-emerald-600">
            Reset Password 🔐
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Create a new password
          </p>
        </div>

        <div className="space-y-4">

          {/* NEW PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
              />

              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-4 cursor-pointer text-gray-500 text-sm"
              >
                {showPass ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="text-sm text-gray-600">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-emerald-400 outline-none"
              />

              <span
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-4 cursor-pointer text-gray-500 text-sm"
              >
                {showConfirm ? "Hide" : "Show"}
              </span>
            </div>
          </div>

          {/* BUTTON */}
          <button
            onClick={reset}
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password →"}
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
    </div>
  );
}
