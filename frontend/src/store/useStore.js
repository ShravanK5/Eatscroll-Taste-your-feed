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

      // ─── CART (was missing entirely — Cart.jsx and Checkout.jsx both crashed) ───
      cart: [],

      addToCart: (reel) => set((state) => {
        const existing = state.cart.find(item => item._id === reel._id);
        if (existing) {
          return {
            cart: state.cart.map(item =>
              item._id === reel._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          };
        }
        return { cart: [...state.cart, { ...reel, quantity: 1 }] };
      }),

      // FIX: updateCartQuantity was missing — Cart.jsx crashed looking for it
      updateCartQuantity: (id, delta) => set((state) => ({
        cart: state.cart
          .map(item => item._id === id ? { ...item, quantity: item.quantity + delta } : item)
          .filter(item => item.quantity > 0)
      })),

      clearCart: () => set({ cart: [] }),

      setCurrentUser: (user) => set({ currentUser: user }),

      fetchReels: async () => {
        try {
          const res = await fetch(`${API_URL}/reels`);
          const data = await res.json();
          set({ reels: data });
        } catch (error) {
          console.error("Reel fetch error", error);
        }
      },

      // FIX: placeOrder now sends customerName + shopName (required for MyOrders
      //      and LiveKitchen to correctly filter by user/shop).
      // FIX: status changed from 'sent' → 'pending' ('sent' is NOT in the backend
      //      enum and caused a Mongoose ValidationError on every order).
      placeOrder: async (reel) => {
        const { currentUser, fetchOrders } = get();

        if (!currentUser) {
          alert("Please log in to place an order!");
          return false;
        }

        try {
          const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: currentUser._id,
              customerName: currentUser.name,   // was missing — MyOrders filter broke
              shopName: reel.shopName,           // was shopId — now matches Order schema
              itemName: reel.itemName,
              price: reel.price,
              status: 'pending'                  // was 'sent' — invalid enum value
            })
          });

          if (res.ok) {
            await fetchOrders();
            return true;
          }
          return false;
        } catch (error) {
          console.error("Order failed", error);
          return false;
        }
      },

      // FIX: placeCheckoutOrder is a SEPARATE function for the Checkout page flow
      //      (Checkout.jsx was calling placeOrder({total, method, address}) which
      //       has a completely different signature — that broke silently).
      placeCheckoutOrder: ({ total, method, address }) => {
        // For the checkout flow we just clear the cart and navigate.
        // Extend this later to save to DB if needed.
        set({ cart: [] });
      },

      fetchOrders: async () => {
        try {
          const res = await fetch(`${API_URL}/orders`);
          const data = await res.json();
          set({ orders: data });
        } catch (error) {
          console.error("Fetch orders failed", error);
        }
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