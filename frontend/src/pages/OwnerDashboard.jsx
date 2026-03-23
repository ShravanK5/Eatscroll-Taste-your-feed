import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Package, DollarSign, LogOut, Video } from 'lucide-react';

export default function OwnerDashboard() {
  const { orders, isOwnerLoggedIn, ownerLogout } = useStore();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');

  if (!isOwnerLoggedIn) { navigate('/owner/login'); return null; }

  const handleLogout = () => { ownerLogout(); navigate('/owner/login'); };

  return (
    <div className="h-full bg-dark overflow-y-auto pb-6">
      <div className="bg-amber p-6 pb-8 pt-12 rounded-b-3xl text-white shadow-lg relative">
        <button onClick={handleLogout} className="absolute top-10 right-6 p-2 bg-black/20 rounded-full"><LogOut size={20} /></button>
        <h1 className="text-2xl font-display font-bold">La Bella Dashboard</h1>
        <p className="opacity-80">Welcome back, Chef.</p>
      </div>
      <div className="flex px-4 mt-6 gap-2 overflow-x-auto no-scrollbar">
        {['overview', 'orders'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-2 rounded-full font-bold capitalize ${tab === t ? 'bg-white text-dark' : 'glass-dark text-white'}`}>{t}</button>
        ))}
      </div>
      <div className="p-4 mt-4">
        {tab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-dark p-5 rounded-2xl border border-white/10"><TrendingUp className="text-amber mb-2" /><p className="text-gray-400 text-sm">Views</p><p className="text-2xl font-bold">124.5k</p></div>
              <div className="glass-dark p-5 rounded-2xl border border-white/10"><DollarSign className="text-green-500 mb-2" /><p className="text-gray-400 text-sm">Revenue</p><p className="text-2xl font-bold">$3,420</p></div>
            </div>
            <button onClick={() => navigate('/owner/upload')} className="w-full glass-dark border-2 border-dashed border-white/20 p-8 rounded-2xl flex flex-col items-center text-gray-400 hover:border-amber hover:text-amber transition-colors"><Video size={32} className="mb-2" /><span className="font-bold">Upload New Reel</span></button>
          </div>
        )}
        {tab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? <p className="text-center text-gray-500 mt-10">No orders yet today.</p> : orders.map(order => (
              <div key={order.id} className="glass-dark p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2"><div className="p-2 bg-amber/20 text-amber rounded-lg"><Package size={18} /></div><span className="font-bold">{order.id}</span></div>
                  <span className="bg-amber/20 text-amber px-3 py-1 rounded-full text-xs font-bold">{order.status}</span>
                </div>
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm mb-1 text-gray-300"><span>{item.quantity}x {item.itemName}</span><span>${(item.price * item.quantity).toFixed(2)}</span></div>
                ))}
                <div className="mt-3 pt-3 flex justify-between font-bold border-t border-white/10"><span>Total</span><span className="text-amber">${order.total.toFixed(2)}</span></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}