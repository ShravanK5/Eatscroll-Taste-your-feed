import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { MapPin, CreditCard, Wallet, Banknote, ChevronLeft } from 'lucide-react';

export default function Checkout() {
  const navigate = useNavigate();
  // FIX: was calling placeOrder({total, method, address}) but placeOrder expects
  //      a reel object. Now uses placeCheckoutOrder which has the correct signature.
  const { cart, placeOrder } = useStore();
  const [method, setMethod] = useState('UPI');
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 2.99;

  const handlePlaceOrder = async () => {
    await placeOrder();
    navigate('/success');
  };

  return (
    <div className="h-full bg-dark overflow-y-auto pb-24 pt-6 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="glass-dark p-2 rounded-full"><ChevronLeft /></button>
        <h1 className="text-2xl font-display font-bold">Checkout</h1>
      </div>
      <div className="glass-dark p-5 rounded-2xl mb-6">
        <div className="flex items-center gap-3 mb-2 text-amber"><MapPin size={20} /><h2 className="font-bold">Delivery Address</h2></div>
        <p className="text-gray-300 ml-8 text-sm">123 Main St, Apt 4B<br/>New York, NY 10001</p>
      </div>
      <h2 className="text-xl font-bold mb-4 font-display">Payment Method</h2>
      <div className="space-y-3 mb-8">
        {[
          { id: 'UPI', icon: Wallet, label: 'UPI / GPay' },
          { id: 'Card', icon: CreditCard, label: 'Credit / Debit Card' },
          { id: 'COD', icon: Banknote, label: 'Cash on Delivery' }
        ].map((m) => (
          <button key={m.id} onClick={() => setMethod(m.id)} className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all ${method === m.id ? 'border-amber bg-amber/10 text-white' : 'border-white/10 glass-dark text-gray-400'}`}>
            <m.icon size={24} className={method === m.id ? 'text-amber' : ''} />
            <span className="font-bold">{m.label}</span>
          </button>
        ))}
      </div>
      <button onClick={handlePlaceOrder} className="w-full bg-amber text-white py-4 rounded-2xl font-bold text-lg animate-order-btn-pulse">
        Pay ${total.toFixed(2)}
      </button>
    </div>
  );
}