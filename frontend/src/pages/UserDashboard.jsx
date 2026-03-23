import React, { useState, useEffect } from 'react';
import socket from '../socket';

const UserDashboard = () => {
  const [myOrders, setMyOrders] = useState([]);

  useEffect(() => {
    // 1. Fetch orders from the database
    const fetchMyOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/orders`);
        const data = await response.json();

        // Since we don't have login yet, we filter for our hardcoded "Guest User"
        const filteredOrders = data.filter(order => order.customerName === 'Guest User');
        setMyOrders(filteredOrders);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      }
    };
    fetchMyOrders();

    // 2. Listen for real-time updates from the Chef!
    socket.on('status-changed', (updatedData) => {
      setMyOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === updatedData.orderId
            ? { ...order, status: updatedData.status }
            : order
        )
      );
    });

    return () => socket.off('status-changed');
  }, []);

  return (
    <div className="min-h-screen bg-dark text-white p-6 pb-24 font-body overflow-y-auto">
      <h1 className="text-3xl font-display font-bold mb-6 text-center border-b border-gray-700 pb-4">
        📱 My Orders
      </h1>

      {myOrders.length === 0 ? (
        <div className="text-center text-gray-400 mt-10">
          <p className="text-xl">You haven't ordered anything yet! 🍔</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {myOrders.map((order) => (
            <div key={order._id} className="bg-black/50 border border-gray-700 rounded-lg p-5 shadow-lg relative">

              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white">{order.itemName}</h3>

                {/* Dynamic Status Badge */}
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                  ${order.status === 'pending' ? 'bg-yellow-500 text-black' :
                    order.status === 'accepted' ? 'bg-blue-500 text-white animate-pulse' :
                      order.status === 'ready' ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.8)]' :
                        'bg-red-500 text-white'}`}
                >
                  {order.status === 'pending' ? 'Waiting on Shop...' :
                    order.status === 'accepted' ? '👨‍🍳 Preparing' :
                      order.status === 'ready' ? '🛍️ Ready for Pickup' : 'Cancelled'}
                </span>
              </div>

              <p className="text-gray-400 text-sm mb-2">{order.shopName}</p>

              <div className="flex justify-between items-center mt-4">
                <p className="text-green-400 font-bold">${order.price}</p>
                <p className="text-gray-500 text-xs">
                  {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;