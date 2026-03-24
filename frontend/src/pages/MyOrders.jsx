import React, { useEffect, useState } from 'react';
import socket from '../socket';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};

  useEffect(() => {
    // FIX: was filtering by o.customerName === user.name, but the old placeOrder
    //      never sent customerName so the filter always returned 0 results.
    //      Now filters by userId (o.userId === user._id) which is always saved,
    //      with a fallback to customerName for orders saved via socket (ReelCard).
    fetch(`${API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then(data => {
        const myOrders = data.filter(o =>
          o.userId === user._id || o.customerName === user.name
        );
        setOrders(myOrders);
      })
      .catch(err => console.error('Failed to fetch orders', err));

    socket.on('status-changed', ({ orderId, status }) => {
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
    });

    // FIX: was listening on 'update-status' — but server emits 'status-changed'
    //      from the socket update-status handler. Aligned to match server.js.
    socket.on('incoming-order', (newOrder) => {
      if (newOrder.userId === user._id || newOrder.customerName === user.name) {
        setOrders(prev => [newOrder, ...prev]);
      }
    });

    return () => {
      socket.off('update-status');
      socket.off('status-changed');
      socket.off('incoming-order');
    };
  }, [user._id, user.name]);

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
                  <p className="text-sm text-gray-500">{order.shopName} • ₹{order.price}</p>
                </div>
                <div className="text-2xl">
                  {order.status === 'ready' ? '✅' : order.status === 'preparing' ? '🔥' : '⏳'}
                </div>
              </div>

              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden flex mb-2 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: getProgressWidth(order.status) }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`h-full rounded-full ${
                    order.status === 'pending' ? 'bg-orange-400' :
                    order.status === 'preparing' ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                />
              </div>

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