import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Store } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function OwnerLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setCurrentUser } = useStore();
  const navigate = useNavigate();

  // FIX: was calling ownerLogin(email, password) from the store — this function
  //      NEVER existed in useStore.js. Every click crashed with
  //      "ownerLogin is not a function".
  //      Replaced with a real API call to the backend /auth/login route,
  //      identical to what Landing.jsx does, but restricted to role === 'owner'.
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      const { user, token } = res.data;

      if (!user || user.role !== 'owner') {
        setError('This account is not registered as an owner.');
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      navigate('/owner/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="h-full bg-dark flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 bg-amber/20 rounded-2xl flex items-center justify-center mb-6 text-amber">
        <Store size={32} />
      </div>
      <h1 className="text-3xl font-display font-bold mb-2 text-center">Owner Portal</h1>
      <p className="text-gray-400 mb-8 text-center">Manage your restaurant, reels, and orders.</p>
      <form onSubmit={handleLogin} className="w-full space-y-4">
        {error && (
          <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</p>
        )}
        <input
          type="email"
          placeholder="Owner email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-dark-2 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber outline-none"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full bg-dark-2 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber outline-none"
        />
        <button type="submit" className="w-full bg-amber text-white py-4 rounded-xl font-bold mt-4">
          Login to Dashboard
        </button>
      </form>
    </div>
  );
}