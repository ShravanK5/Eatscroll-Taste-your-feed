import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config'; 
import { useStore } from '../store/useStore';

export default function Landing() {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register
  const [isUser, setIsUser] = useState(true);
  const [name, setName] = useState('');         // Needed for backend /register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    
    try {
      let realUser;
      let token;
      
      if (isLogin) {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        realUser = res.data.user;
        token = res.data.token;
      } else {
        await axios.post(`${API_BASE_URL}/api/auth/register`, {
          name,
          email,
          password,
          role: isUser ? 'customer' : 'owner',
          shopName: !isUser ? `${name}'s Kitchen` : undefined
        });
        
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
        realUser = res.data.user;
        token = res.data.token;
      }

      if (token && realUser) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(realUser));
        localStorage.setItem('currentUser', JSON.stringify(realUser));
        useStore.getState().setCurrentUser(realUser);
        
        if (realUser.role === 'customer' || isUser) {
          navigate('/feed');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error("Auth Error:", err.response?.data);
      alert(err.response?.data?.error || "Authentication Failed! Make sure your backend server is running.");
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-8 font-sans">
      
      {/* 1. REFINED BRANDING SECTION */}
      <div className="flex flex-col items-center mb-16 select-none">
        <h1 className="text-5xl font-[900] tracking-tighter text-white flex items-baseline gap-1">
          <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Eat
          </span>
          <span className="text-orange-500 italic">Scroll</span>
        </h1>
        <div className="h-[3px] w-8 bg-orange-500 rounded-full mt-1 opacity-80"></div>
        <p className="text-[9px] text-gray-500 uppercase tracking-[0.4em] mt-3 font-black">
          Taste the Feed
        </p>
      </div>

      <div className="w-full max-w-sm space-y-8">
        
        {/* 2. MODERN PILL ROLE TOGGLE */}
        <div className="relative flex bg-gray-900/80 backdrop-blur-xl p-1.5 rounded-2xl border border-gray-800/50">
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-orange-500 rounded-xl transition-all duration-300 ease-out ${
              isUser ? 'left-1.5' : 'left-[calc(50%+3px)]'
            }`}
          />
          
          <button 
            type="button"
            onClick={() => setIsUser(true)}
            className={`relative z-10 flex-1 py-3 font-black text-xs uppercase tracking-widest transition-colors duration-300 ${
              isUser ? 'text-black' : 'text-gray-500'
            }`}
          >
            User
          </button>
          <button 
            type="button"
            onClick={() => setIsUser(false)}
            className={`relative z-10 flex-1 py-3 font-black text-xs uppercase tracking-widest transition-colors duration-300 ${
              !isUser ? 'text-black' : 'text-gray-500'
            }`}
          >
            Chef
          </button>
        </div>

        {/* 3. LOGIN/REGISTER FORM */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-3">
            {/* Show Name field only if they are creating an account */}
            {!isLogin && (
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-900/50 border border-gray-800 p-4 rounded-2xl outline-none focus:border-orange-500/50 text-white placeholder:text-gray-600 transition-all focus:bg-gray-900"
              />
            )}
            <input 
              type="email" 
              placeholder="Email address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-800 p-4 rounded-2xl outline-none focus:border-orange-500/50 text-white placeholder:text-gray-600 transition-all focus:bg-gray-900"
            />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-800 p-4 rounded-2xl outline-none focus:border-orange-500/50 text-white placeholder:text-gray-600 transition-all focus:bg-gray-900"
            />
          </div>

          <button 
            type="submit"
            className="w-auto px-10 mx-auto block bg-orange-500 text-black font-[900] py-4 rounded-2xl hover:bg-orange-400 active:scale-95 transition-all shadow-xl shadow-orange-500/20 tracking-tighter mt-4 uppercase"
          >
            {isLogin ? 'GET STARTED 🚀' : 'CREATE ACCOUNT 🚀'}
          </button>
        </form>

        {/* 4. FOOTER LINKS (Toggles between Login and Register) */}
        <div className="pt-4 text-center">
          <p className="text-gray-600 text-[11px] font-bold uppercase tracking-widest">
            {isLogin ? "New here? " : "Already have an account? "}
            <span 
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-500 cursor-pointer hover:underline"
            >
              {isLogin ? "Create Account" : "Login Now"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}