import { API_BASE_URL } from "../config";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : ""
  };
};

export const API = {
  login: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  getReels: async () => {
    const res = await fetch(`${API_BASE_URL}/api/reels`);
    return res.json();
  },

  createOrder: async (data) => {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      alert(err.error || "Order failed");
      return null;
    }

    return res.json();
  },

  likeReel: async (id) => {
    const res = await fetch(`${API_BASE_URL}/api/reels/like/${id}`, {
      method: "PATCH"
    });
    return res.json();
  }
};