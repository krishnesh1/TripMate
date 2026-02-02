import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  // Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 👇 NEW STATE
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const toastRef = useRef(false);

  const showToastOnce = (type, message, id) => {
    if (toastRef.current) return;
    toast[type](message, { id });
    toastRef.current = true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = isLogin
        ? await login(email, password)
        : await signup(name, email, password);

      if (result.success) {
        showToastOnce(
          "success",
          isLogin
            ? "Logged in successfully 🎉"
            : "Account created successfully 🚀",
          "auth-success",
        );
        navigate("/");
      } else {
        showToastOnce(
          "error",
          result.message || "Authentication failed",
          "auth-error",
        );
      }
    } catch {
      showToastOnce("error", "Something went wrong ❌", "auth-failed");
    } finally {
      setLoading(false);
      toastRef.current = false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-rose-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        {/* LOGO */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-xl bg-emerald-500 flex items-center justify-center text-white text-2xl font-bold shadow">
            <img
              src="/logo.png"
              alt="TripMate Logo"
              className="h-10 w-10 object-contain"
            />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-emerald-600">TripMate</h1>
          <p className="text-sm text-gray-500 mt-1">
            Split expenses with friends, hassle-free ✨
          </p>
        </div>

        {/* TABS */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              isLogin ? "bg-white shadow text-gray-900" : "text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              !isLogin ? "bg-white shadow text-gray-900" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-1 w-full rounded-xl border px-4 py-3 focus:ring-2 focus:ring-emerald-400 outline-none"
            />
          </div>

          {/* PASSWORD  */}
          <div className="relative">
            <label className="text-sm font-medium text-gray-600">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Password"
              className="mt-1 w-full rounded-xl border px-4 py-3 pr-16 focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-10 text-sm font-medium text-emerald-600 hover:text-emerald-800"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {isLogin && (
            <p
              onClick={() => navigate("/forgot-password")}
              className="text-right text-sm text-emerald-600 cursor-pointer hover:underline mt-1"
            >
              Forgot Password?
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-emerald-500 text-white font-semibold text-lg hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In →"
              : "Create Account →"}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? "New to TripMate? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-emerald-600 font-medium hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </p>

      </div>
    </div>
  );
};

export default Auth;
