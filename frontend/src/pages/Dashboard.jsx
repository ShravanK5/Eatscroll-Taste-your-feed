import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};

  // Protection: If not an owner, redirect or show error
  if (user.role !== 'owner') {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white p-6 text-center">
        <div>
          <h1 className="text-4xl mb-4">🚫</h1>
          <p className="text-xl font-bold">Access Denied</p>
          <p className="text-gray-400 mt-2">This area is for Restaurant Owners only.</p>
          <button onClick={() => navigate('/')} className="mt-6 bg-orange-500 px-6 py-2 rounded-full">Back to Home</button>
        </div>
      </div>
    );
  }

  const menuItems = [
    {
      title: "Live Kitchen",
      desc: "Manage incoming orders in real-time",
      icon: "👨‍🍳",
      path: "/live-kitchen",
      color: "from-orange-500 to-red-600",
      badge: "LIVE"
    },
    {
      title: "Upload Reel",
      desc: "Post a new video to attract customers",
      icon: "🎥",
      path: "/upload",
      color: "from-purple-600 to-blue-600",
      badge: "NEW"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header Section */}
      <header className="mb-10 mt-4">
        <p className="text-orange-600 font-bold tracking-widest text-xs uppercase">Store Manager</p>
        <h1 className="text-4xl font-black text-gray-900 drop-shadow-sm">
          {user.shopName || "My Shop"}
        </h1>
        <div className="h-1 w-20 bg-orange-500 mt-2 rounded-full"></div>
      </header>

      {/* Navigation Grid */}
      <div className="grid gap-6">
        {menuItems.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(item.path)}
            className={`relative overflow-hidden cursor-pointer rounded-3xl p-8 bg-gradient-to-br ${item.color} shadow-xl shadow-gray-200 text-white`}
          >
            {/* Background Icon Decoration */}
            <span className="absolute -right-4 -bottom-4 text-9xl opacity-10 rotate-12 pointer-events-none">
              {item.icon}
            </span>

            <div className="relative z-10 flex justify-between items-start">
              <div>
                <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black tracking-tighter w-fit mb-4">
                  {item.badge}
                </div>
                <h2 className="text-3xl font-black mb-2 flex items-center gap-3">
                  {item.icon} {item.title}
                </h2>
                <p className="text-white/80 font-medium max-w-[200px]">
                  {item.desc}
                </p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats Placeholder */}
      <div className="mt-10 grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase">Today's Sales</p>
          <p className="text-2xl font-black text-gray-900">$0.00</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <p className="text-gray-400 text-xs font-bold uppercase">Reel Views</p>
          <p className="text-2xl font-black text-gray-900">0</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;