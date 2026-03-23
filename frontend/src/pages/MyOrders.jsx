import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};

  useEffect(() => {
    // Fetch initial orders for THIS user
    fetch(`${API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then(data => {
        const myOrders = data.filter(o => o.customerName === user.name);
        setOrders(myOrders);
      });

    // Listen for real-time status updates from the Chef!
    socket.on('update-status', ({ orderId, status }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    });

    return () => socket.off('update-status');
  }, [user.name]);

  const getProgressWidth = (status) => {
    if (status === 'pending') return '33%';
    if (status === 'preparing') return '66%';
    if (status === 'ready') return '100%';
    return '0%';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24">
      <h1 className="text-3xl font-black mb-1 text-gray-900">My Orders 🧾</h1>
      <p className="text-gray-500 text-sm mb-8">Track your food in real-time</p>

      <div className="space-y-4">
        <AnimatePresence>
          {orders.map(order => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{order.itemName}</h3>
                  <p className="text-sm text-gray-500">{order.shopName} • ${order.price}</p>
                </div>
                <div className="text-2xl">
                  {order.status === 'ready' ? '✅' : order.status === 'preparing' ? '🔥' : '⏳'}
                </div>
              </div>

              {/* Animated Progress Bar */}
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden flex mb-2 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: getProgressWidth(order.status) }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`h-full rounded-full ${order.status === 'pending' ? 'bg-orange-400' :
                      order.status === 'preparing' ? 'bg-blue-500' : 'bg-green-500'
                    }`}
                />
              </div>

              {/* Status Labels */}
              <div className="flex justify-between text-[10px] font-black tracking-widest uppercase mt-2">
                <span className={order.status === 'pending' ? 'text-orange-500' : 'text-gray-300'}>Sent</span>
                <span className={order.status === 'preparing' ? 'text-blue-500' : 'text-gray-300'}>Cooking</span>
                <span className={order.status === 'ready' ? 'text-green-500' : 'text-gray-300'}>Ready</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {orders.length === 0 && (
          <div className="text-center py-20 text-gray-400 font-medium">
            <p className="text-5xl mb-4">🍽️</p>
            <p>You haven't ordered anything yet!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;