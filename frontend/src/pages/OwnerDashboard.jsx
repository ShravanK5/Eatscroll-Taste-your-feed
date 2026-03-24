import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Package, DollarSign, LogOut, Video } from 'lucide-react';

export default function OwnerDashboard() {
  const { orders, setCurrentUser } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  // FIX: was using isOwnerLoggedIn from store — that function NEVER existed in
  //      useStore.js so this crashed immediately with "isOwnerLoggedIn is not a function".
  //      Now reads directly from localStorage (same pattern as Dashboard.jsx).
  const user = JSON.parse(localStorage.getItem('currentUser'));
  if (!user || user.role !== 'owner') {
    navigate('/');
    return null;
  }

  // FIX: was calling ownerLogout() — also never existed in the store.
  //      Real logout = clear localStorage + clear Zustand currentUser.
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    navigate('/');
  };

  // FIX: orders from the store are flat objects {_id, itemName, price, status…}
  //      The old render accessed order.items (array) and order.total — neither
  //      field exists in the Order schema. That caused a crash: "Cannot read
  //      properties of undefined (reading 'map')". Replaced with correct fields.
  const myOrders = orders.filter(o => o.shopName === user.shopName);

  return (
    <div className="h-full bg-dark overflow-y-auto pb-6">
      <div className="bg-amber p-6 pb-8 pt-12 rounded-b-3xl text-white shadow-lg relative">
        <button onClick={handleLogout} className="absolute top-10 right-6 p-2 bg-black/20 rounded-full">
          <LogOut size={20} />
        </button>
        <h1 className="text-2xl font-display font-bold">{user.shopName || 'My Kitchen'}</h1>
        <p className="opacity-80">Welcome back, Chef.</p>
      </div>

      <div className="flex px-4 mt-6 gap-2 overflow-x-auto no-scrollbar">
        {['overview', 'orders'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-full font-bold capitalize ${tab === t ? 'bg-white text-dark' : 'glass-dark text-white'}`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="p-4 mt-4">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-dark p-5 rounded-2xl border border-white/10">
                <TrendingUp className="text-amber mb-2" />
                <p className="text-gray-400 text-sm">Orders Today</p>
                <p className="text-2xl font-bold">{myOrders.length}</p>
              </div>
              <div className="glass-dark p-5 rounded-2xl border border-white/10">
                <DollarSign className="text-green-500 mb-2" />
                <p className="text-gray-400 text-sm">Revenue</p>
                <p className="text-2xl font-bold">
                  ₹{myOrders.reduce((sum, o) => sum + (o.price || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>
            {/* FIX: navigate to /owner/upload (legacy) or /upload (real) — both are now registered */}
            <button
              onClick={() => navigate('/upload')}
              className="w-full glass-dark border-2 border-dashed border-white/20 p-8 rounded-2xl flex flex-col items-center text-gray-400 hover:border-amber hover:text-amber transition-colors"
            >
              <Video size={32} className="mb-2" />
              <span className="font-bold">Upload New Reel</span>
            </button>
          </div>
        )}

        {tab === 'orders' && (
          <div className="space-y-4">
            {myOrders.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">No orders yet today.</p>
            ) : myOrders.map(order => (
              // FIX: was order.id — MongoDB uses order._id
              <div key={order._id} className="glass-dark p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-amber/20 text-amber rounded-lg"><Package size={18} /></div>
                    {/* FIX: was order.id — should be order.itemName */}
                    <span className="font-bold">{order.itemName}</span>
                  </div>
                  <span className="bg-amber/20 text-amber px-3 py-1 rounded-full text-xs font-bold">
                    {order.status}
                  </span>
                </div>
                {/* FIX: removed order.items.map() — Order schema has no items array.
                    Replaced with flat fields that actually exist. */}
                <div className="flex justify-between text-sm mb-1 text-gray-300">
                  <span>{order.customerName || 'Customer'}</span>
                  <span>₹{order.price?.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}