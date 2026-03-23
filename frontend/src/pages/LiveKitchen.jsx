import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';
const LiveKitchen = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};

  useEffect(() => {
    // 1. Fetch Existing Orders
    fetch(`${API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then(data => {
        const myOrders = data.filter(o => o.shopName === user.shopName);
        setOrders(myOrders);
      });

    // 2. Listen for Real-time Orders
    socket.on('incoming-order', (newOrder) => {
      if (newOrder.shopName === user.shopName) {
        setOrders(prev => [newOrder, ...prev]);
        // Optional: Add a notification sound here!
      }
    });

    return () => socket.off('incoming-order');
  }, [user.shopName]);

  const updateStatus = async (orderId, newStatus) => {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`,{
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    });
    if (res.ok) {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      socket.emit('update-status', { orderId, status: newStatus });
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Remove this order from history?")) return;
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, { method: 'DELETE' });
    if (res.ok) setOrders(prev => prev.filter(o => o._id !== orderId));
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-orange-500">LIVE KITCHEN</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Real-time Order Stream</p>
        </div>
        <div className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-[10px] font-bold animate-pulse border border-green-500/20">
          CONNECTED
        </div>
      </header>

      <div className="space-y-4">
        <AnimatePresence>
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gray-900 border border-gray-800 p-5 rounded-3xl"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{order.itemName}</h3>
                  <p className="text-gray-400 text-sm">Customer: {order.customerName}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                  order.status === 'pending' ? 'bg-orange-500 text-black' : 'bg-blue-500 text-white'
                }`}>
                  {order.status}
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => updateStatus(order._id, 'preparing')}
                  className="flex-1 bg-white text-black font-bold py-3 rounded-2xl text-xs active:scale-95 transition"
                >
                  PREPARE
                </button>
                <button 
                  onClick={() => updateStatus(order._id, 'ready')}
                  className="flex-1 bg-green-500 text-black font-bold py-3 rounded-2xl text-xs active:scale-95 transition"
                >
                  READY
                </button>
                <button 
                  onClick={() => deleteOrder(order._id)}
                  className="px-5 bg-gray-800 rounded-2xl text-red-500"
                >
                  🗑️
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {orders.length === 0 && (
          <div className="text-center py-20 text-gray-600 italic">
            Waiting for hunger to strike... 🍕
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveKitchen;