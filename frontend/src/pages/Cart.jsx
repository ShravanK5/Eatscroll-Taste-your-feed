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
        <ShoppingBag size={64} className="text-gray-500 mb-4" />
        <h2 className="text-2xl font-display font-bold mb-2">Your cart is empty</h2>
        <button onClick={() => navigate('/feed')} className="bg-orange-500 text-white px-8 py-3 rounded-full font-bold">
          Start Browsing
        </button>
      </div>
    );
  }

  return (
    <div className="h-full bg-dark overflow-y-auto pb-24 pt-8 px-4">
      <h1 className="text-3xl font-display font-bold mb-6">Your Cart</h1>
      <div className="space-y-4 mb-8">
        {cart.map((item) => (
          <div key={item._id} className="glass-dark p-4 rounded-2xl flex items-center gap-4">
            <div className="w-20 h-20 bg-gray-900 rounded-xl overflow-hidden flex-shrink-0">
              {/* FIX: was item.mediaUrl — correct field from Reel schema is item.videoUrl */}
              <video src={item.videoUrl} className="w-full h-full object-cover" muted />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg leading-tight">{item.itemName}</h3>
              <p className="text-orange-400 font-bold">₹{item.price.toFixed(2)}</p>
              <div className="flex items-center gap-4 mt-2">
                {/* FIX: updateCartQuantity now correctly uses item._id (MongoDB id) */}
                <button onClick={() => updateCartQuantity(item._id, -1)} className="p-1 bg-gray-800 rounded-full">
                  <Minus size={16} />
                </button>
                <span className="font-bold">{item.quantity}</span>
                <button onClick={() => updateCartQuantity(item._id, 1)} className="p-1 bg-orange-500/20 text-orange-400 rounded-full">
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-dark p-6 rounded-3xl mb-8 border border-white/5">
        <div className="flex justify-between mb-2 text-gray-400"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between mb-4 text-gray-400"><span>Delivery Fee</span><span>₹{deliveryFee.toFixed(2)}</span></div>
        <div className="flex justify-between font-bold text-xl border-t border-white/10 pt-4">
          <span>Total</span><span className="text-orange-400">₹{total.toFixed(2)}</span>
        </div>
      </div>
      <button
        onClick={() => navigate('/checkout')}
        className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2"
      >
        Proceed to Checkout <ArrowRight size={20} />
      </button>
    </div>
  );
}