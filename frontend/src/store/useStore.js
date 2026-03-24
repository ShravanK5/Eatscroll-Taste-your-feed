import { create } from "zustand";
import { API } from "../api/api";
import { API_BASE_URL } from "../config";

export const useStore = create((set, get) => ({
  reels: [],
  cart: [],
  orders: [],
  currentUser: null,
  userLikes: [],

  setCurrentUser: (user) => set({ currentUser: user }),

  // 🔐 LOGIN
  login: async (data) => {
    const res = await API.login(data);
    if (res.token) {
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user)); // ✅ SAVE USER
      set({ currentUser: res.user });
    }
  },

  // 🔥 AUTO LOGIN (IMPORTANT)
  loadUser: () => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      set({ currentUser: JSON.parse(savedUser) });
    }
  },

  fetchReels: async () => {
    const data = await API.getReels();
    set({ reels: data });
  },

  fetchOrders: async () => {
    const res = await fetch(`${API_BASE_URL}/api/orders`, {
      headers: {
        Authorization: localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : ""
      }
    });
    const data = await res.json();
    set({ orders: data });
  },

  addToCart: (item) => {
    set((state) => ({
      cart: [...state.cart, { ...item, quantity: 1 }]
    }));
  },

  placeOrder: async (reel, quantity = 1) => {
    const { cart, currentUser } = get();

    if (!currentUser) {
      alert("Please login first");
      return false;
    }

    let items, totalAmount, shopName;

    if (reel) {
      items = [{
        itemName: reel.itemName,
        quantity: quantity,
        price: reel.price
      }];
      totalAmount = reel.price * quantity;
      shopName = reel.shopName;
    } else {
      if (cart.length === 0) return false;
      items = cart.map(item => ({
        itemName: item.itemName,
        quantity: item.quantity,
        price: item.price
      }));
      totalAmount = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      shopName = cart[0]?.shopName;
    }

    const orderRes = await API.createOrder({
      items,
      totalAmount,
      shopName
    });
    
    if (orderRes) {
      if (!reel) set({ cart: [] });
      return true;
    }
    return false;
  },

  likeReel: async (id) => {
    const updated = await API.likeReel(id);

    set((state) => ({
      reels: state.reels.map(r =>
        r._id === id ? updated : r
      )
    }));
  },

  toggleLike: async (id) => {
    const { userLikes, likeReel } = get();
    await likeReel(id);
    
    // Toggle locally for fast UI
    if (userLikes.includes(id)) {
      set({ userLikes: userLikes.filter(likedId => likedId !== id) });
    } else {
      set({ userLikes: [...userLikes, id] });
    }
  }
}));