const API_URL =
  import.meta.env.VITE_API_URL || "https://experienced-harri-abcde1-04308873.koyeb.app/api";

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", 
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
  },

  googleLogin: async (credential) => {
    const res = await fetch(`${API_URL}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ credential }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Google login failed");
    return data;
  },

  signup: async (name, email, password) => {
    const res = await fetch(`${API_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Signup failed");
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    });

    if (res.status === 401) {

      return null;
    }

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    return res.json();
  },

  logout: async () => {
    const res = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Logout failed");
    return data;
  },

  forgotPassword: async (email) => {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  resetPassword: async (email, password) => {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    return res.json();
  },

  verifyOTP: async (email, otp) => {
    const res = await fetch(`${API_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },
};

// Trips API
export const tripsAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/trips`, {
      credentials: "include",
    });
    return res.json();
  },

  create: async (name) => {
    const res = await fetch(`${API_URL}/trips`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create trip");
    return data;
  },
};

// Members API
export const membersAPI = {
  getAll: async (tripId) => {
    const res = await fetch(`${API_URL}/members?tripId=${tripId}`, {
      credentials: "include",
    });
    return res.json();
  },

  create: async (name, tripId) => {
    const res = await fetch(`${API_URL}/members`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, tripId }),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/members/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },
};

// Expenses API
export const expensesAPI = {
  getAll: async (tripId) => {
    const res = await fetch(`${API_URL}/expenses?tripId=${tripId}`, {
      credentials: "include",
    });
    return res.json();
  },

  create: async (payerId, amount, description, tripId, excludedMemberIds = []) => {
    const res = await fetch(`${API_URL}/expenses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ payerId, amount, description, tripId, excludedMemberIds }),
    });
    return res.json();
  },

  reset: async (tripId) => {
    const res = await fetch(`${API_URL}/expenses/reset?tripId=${tripId}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/expenses/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    return res.json();
  },
};
