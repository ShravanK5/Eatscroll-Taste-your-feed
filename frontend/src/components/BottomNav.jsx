import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Safely get the user from local storage
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};
  const isOwner = user.role === 'owner';

  // Define the base navigation items that EVERYONE sees
  const navItems = [
    { name: 'Home', icon: '🏠', path: '/feed' },
    { name: 'Discover', icon: '🔍', path: '/discover' },
  ];

  // 🔀 CONDITIONAL LOGIC: Add the 3rd button based on role
  if (isOwner) {
    navItems.push({ name: 'Kitchen', icon: '👨‍🍳', path: '/dashboard' });
  } else {
    navItems.push({ name: 'My Orders', icon: '🧾', path: '/my-orders' });
  }

  // Add the Profile button at the end for everyone
  navItems.push({ name: 'Profile', icon: '👤', path: '/profile' });

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center justify-center w-16 h-full gap-1"
            >
              <motion.div
                animate={isActive ? { scale: 1.2, y: -2 } : { scale: 1, y: 0 }}
                className={`text-2xl transition-colors duration-200 ${
                  isActive ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'text-gray-500'
                }`}
              >
                {item.icon}
              </motion.div>
              <span 
                className={`text-[10px] font-bold transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-gray-500'
                }`}
              >
                {item.name}
              </span>
              
              {/* Active Dot Indicator */}
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="w-1 h-1 bg-white rounded-full mt-1 absolute bottom-1"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;