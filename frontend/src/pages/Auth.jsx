import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { login, signup, googleLogin } = useAuth();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);

  const toastRef = useRef(false);
  const googleButtonRef = useRef(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
          isLogin ? "Logged in successfully" : "Account created successfully",
          "auth-success",
        );
        navigate("/");
      } else {
        showToastOnce("error", result.message || "Authentication failed", "auth-error");
      }
    } catch {
      showToastOnce("error", "Something went wrong", "auth-failed");
    } finally {
      setLoading(false);
      toastRef.current = false;
    }
  };

  const handleGoogleLogin = async (credential) => {
    setLoading(true);

    try {
      const result = await googleLogin(credential);

      if (result.success) {
        showToastOnce("success", "Logged in with Google", "google-success");
        navigate("/");
      } else {
        showToastOnce("error", result.message || "Google login failed", "google-error");
      }
    } catch {
      showToastOnce("error", "Google login failed", "google-failed");
    } finally {
      setLoading(false);
      toastRef.current = false;
    }
  };

  useEffect(() => {
    if (!googleClientId) return;

    if (window.google) {
      setGoogleReady(true);
      return;
    }

    const intervalId = window.setInterval(() => {
      if (window.google) {
        setGoogleReady(true);
        window.clearInterval(intervalId);
      }
    }, 200);

    return () => window.clearInterval(intervalId);
  }, [googleClientId]);

  useEffect(() => {
    if (!googleClientId || !googleReady || !googleButtonRef.current || !window.google) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: (response) => handleGoogleLogin(response.credential),
    });

    googleButtonRef.current.innerHTML = "";
    window.google.accounts.id.renderButton(googleButtonRef.current, {
      theme: "outline",
      size: "large",
      width: Math.min(400, googleButtonRef.current.offsetWidth || 360),
      text: isLogin ? "signin_with" : "signup_with",
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [googleClientId, googleReady, isLogin]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-emerald-50 via-white to-rose-50 px-4 py-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-8">
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500 text-2xl font-bold text-white shadow">
            <img src="/logo.png" alt="TripMate Logo" className="h-10 w-10 object-contain" />
          </div>
          <h1 className="mt-3 text-2xl font-bold text-emerald-600">TripMate</h1>
          <p className="mt-1 text-center text-sm text-gray-500">
            Split expenses with friends, hassle-free
          </p>
        </div>

        <div className="mb-5 flex rounded-xl bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`min-h-10 flex-1 rounded-lg text-sm font-medium transition ${
              isLogin ? "bg-white text-gray-900 shadow" : "text-gray-500"
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`min-h-10 flex-1 rounded-lg text-sm font-medium transition ${
              !isLogin ? "bg-white text-gray-900 shadow" : "text-gray-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <div className="mb-4">
          {googleClientId ? (
            <div className="flex min-h-11 w-full items-center justify-center rounded-xl border border-gray-200 bg-white px-2 py-1">
              {!googleReady && (
                <span className="text-sm font-medium text-gray-500">
                  Loading Google login...
                </span>
              )}
              <div ref={googleButtonRef} className="w-full" />
            </div>
          ) : (
            <button
              type="button"
              disabled
              className="min-h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-400"
            >
              Continue with Google
            </button>
          )}
        </div>

        <div className="mb-4 flex items-center gap-3 text-xs uppercase text-gray-400">
          <span className="h-px flex-1 bg-gray-200" />
          or
          <span className="h-px flex-1 bg-gray-200" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 min-h-12 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-600">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="mt-1 min-h-12 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="relative">
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Password"
              className="mt-1 min-h-12 w-full rounded-xl border px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-emerald-400"
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
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="ml-auto block text-sm text-emerald-600 hover:underline"
            >
              Forgot Password?
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 min-h-12 w-full rounded-xl bg-emerald-500 py-3 text-lg font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "New to TripMate? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-emerald-600 hover:underline"
          >
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;
