import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';

// Pages
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import Discover from './pages/Discover';
import MyOrders from './pages/MyOrders';
import Profile from './pages/Profile';
import LiveKitchen from './pages/LiveKitchen';
import UploadReel from './pages/UploadReel';
import Dashboard from './pages/Dashboard';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import BottomNav from './components/BottomNav';

function AppContent() {
  // ✅ FIX 1: added loadUser
  const { fetchReels, fetchOrders, loadUser } = useStore();
  const location = useLocation();

  useEffect(() => {
    // ✅ FIX 2: restore user on refresh
    loadUser();

    fetchReels();
    fetchOrders();
  }, []); // ✅ FIX 3: removed dependencies (important)

  const hideNavRoutes = ['/', '/checkout', '/success', '/owner/login'];
  const showNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/feed" element={<Feed />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/success" element={<OrderSuccess />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRole="owner">
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <ProtectedRoute allowedRole="owner">
              <UploadReel />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/live-kitchen" 
          element={
            <ProtectedRoute allowedRole="owner">
              <LiveKitchen />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Landing />} />
      </Routes>

      {showNav && <BottomNav />}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="mx-auto max-w-md relative bg-black h-[100dvh] w-full overflow-hidden shadow-2xl border-x border-gray-900">
        <AppContent />
      </div>
    </BrowserRouter>
  );
}