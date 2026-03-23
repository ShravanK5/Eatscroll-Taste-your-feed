import { Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Cart() {
  const { cart, updateCartQuantity } = useStore();
  const navigate = useNavigate();

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = cart.length > 0 ? 2.99 : 0;
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag size={64} className="text-dark-3 mb-4" />
        <h2 className="text-2xl font-display font-bold mb-2">Your cart is empty</h2>
        <button onClick={() => navigate('/')} className="bg-amber text-white px-8 py-3 rounded-full font-bold">Start Browsing</button>
      </div>
    );
  }

  return (
    <div className="h-full bg-dark overflow-y-auto pb-24 pt-8 px-4">
      <h1 className="text-3xl font-display font-bold mb-6">Your Cart</h1>
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item.id} className="glass-dark p-4 rounded-2xl flex items-center gap-4">
            <div className="w-20 h-20 bg-dark-2 rounded-xl overflow-hidden flex-shrink-0">
              <video src={item.mediaUrl} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight">{item.itemName}</h3>
              <p className="text-amber font-bold">${item.price.toFixed(2)}</p>
              <div className="flex items-center gap-4 mt-2">
                <button onClick={() => updateCartQuantity(item.id, -1)} className="p-1 bg-dark-3 rounded-full"><Minus size={16} /></button>
                <span className="font-bold">{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item.id, 1)} className="p-1 bg-amber/20 text-amber rounded-full"><Plus size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-dark p-6 rounded-3xl mb-8 border border-white/5">
        <div className="flex justify-between mb-2 text-gray-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between mb-4 text-gray-400"><span>Delivery Fee</span><span>${deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-xl border-t border-white/10 pt-4"><span>Total</span><span className="text-amber">${total.toFixed(2)}</span></div>
      </div>
      <button onClick={() => navigate('/checkout')} className="w-full bg-amber text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2">Proceed to Checkout <ArrowRight size={20} /></button>
    </div>
  );
}