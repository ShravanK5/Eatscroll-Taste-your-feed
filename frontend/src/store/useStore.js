import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { API_BASE_URL } from '../config';

const API_URL = `${API_BASE_URL}/api`;

export const useStore = create(
  persist(
    (set, get) => ({
      reels: [],
      orders: [],
      userLikes: [],
      currentUser: null,

      setCurrentUser: (user) => set({ currentUser: user }),
      
      fetchReels: async () => {
        try {
          const res = await fetch(`${API_URL}/reels`);
          const data = await res.json();
          set({ reels: data });
        } catch (error) { console.error("Reel fetch error", error); }
      },

      // THIS LINKS THE BUTTON TO THE DATABASE
      placeOrder: async (reel) => {
        const { currentUser, fetchOrders } = get();
        
        if (!currentUser) {
          alert("Login required!"); // This matches your screenshot
          return false;
        }

        try {
          const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser._id,
              shopId: reel.shopName, 
              itemName: reel.itemName,
              price: reel.price,
              status: 'sent'
            })
          });

          if (res.ok) {
            await fetchOrders(); // Updates "My Orders" view instantly
            return true;
          }
        } catch (error) {
          console.error("Order failed", error);
          return false;
        }
      },

      fetchOrders: async () => {
        try {
          const res = await fetch(`${API_URL}/orders`);
          const data = await res.json();
          set({ orders: data });
        } catch (error) { console.error("Fetch orders failed", error); }
      },

      toggleLike: (reelId) => set((state) => ({
        userLikes: state.userLikes.includes(reelId)
          ? state.userLikes.filter(id => id !== reelId)
          : [...state.userLikes, reelId]
      })),
    }),
    { name: 'foodreels-storage' }
  )
);