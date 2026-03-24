import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { User, Bookmark, Clock, Package, LogOut } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};
  const [tab, setTab] = useState('saved');
  const [userOrders, setUserOrders] = useState([]);

  const { reels, userLikes, fetchReels, setCurrentUser } = useStore();

  useEffect(() => {
    fetchReels();
    if (user._id) {
      fetch(`${API_BASE_URL}/api/orders`)
        .then(res => res.json())
        .then(data => {
          // FIX: now filters by userId OR customerName for backwards compat
          const myOrders = data.filter(
            o => o.userId === user._id || o.customerName === user.name
          );
          setUserOrders(myOrders);
        });
    }
  }, [fetchReels, user._id]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    // FIX: was only clearing localStorage — Zustand currentUser was still set,
    //      so placeOrder() still worked after logout (security bug).
    //      Now also clears the Zustand store.
    setCurrentUser(null);
    navigate('/');
  };

  const likedReels = reels.filter(r => (userLikes || []).includes(r._id));

  return (
    <div className="min-h-screen bg-black overflow-y-auto pb-24 pt-8 px-4 text-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-orange-500/20 text-orange-500 rounded-full flex items-center justify-center">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold">{user.name || "Guest"}</h1>
            <p className="text-gray-400 text-sm">{user.email || "guest@example.com"}</p>
            <span className="text-[10px] uppercase font-bold text-orange-500 tracking-widest">
              {user.role}
            </span>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-3 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500/20 transition"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
        <button
          onClick={() => setTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
            tab === 'saved' ? 'bg-orange-500 text-black' : 'bg-gray-900 text-gray-400'
          }`}
        >
          <Bookmark size={18} /> Saved
        </button>
        {user.role !== 'owner' && (
          <button
            onClick={() => setTab('orders')}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all ${
              tab === 'orders' ? 'bg-white text-black' : 'bg-gray-900 text-gray-400'
            }`}
          >
            <Clock size={18} /> History
          </button>
        )}
      </div>

      {tab === 'saved' && (
        <div className="grid grid-cols-2 gap-3">
          {likedReels.length === 0 ? (
            <p className="col-span-2 text-center text-gray-500 mt-10">No saved reels yet.</p>
          ) : likedReels.map(reel => (
            <div key={reel._id} className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-gray-900">
              <video src={reel.videoUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" muted />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
                <h3 className="font-bold text-sm truncate">{reel.itemName}</h3>
                <p className="text-xs text-gray-400">@{reel.shopName}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'orders' && user.role !== 'owner' && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No past orders.</p>
          ) : userOrders.map(order => (
            <div key={order._id} className="bg-gray-900 p-4 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-gray-300">
                  <Package size={16} />
                  <span className="text-sm font-bold truncate max-w-[150px]">{order.itemName}</span>
                </div>
                <span className="text-orange-500 font-bold">₹{order.price}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-400">
                <span>From: {order.shopName}</span>
                <span className={`px-2 py-1 rounded-full text-[10px] uppercase font-black ${
                  order.status === 'ready' ? 'bg-green-500/20 text-green-500' : 'bg-blue-500/20 text-blue-500'
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}