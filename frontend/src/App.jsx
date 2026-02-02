import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";

import { Toaster } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/auth" replace />;

  return children;
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      {/* 🔔 Global Toaster */}
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#111827",
            color: "#fff",
          },
        }}
      />

      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/verify-otp" element={<VerifyOTP/>}/>

      </Routes>


    </BrowserRouter>
  </AuthProvider>
);

export default App;
