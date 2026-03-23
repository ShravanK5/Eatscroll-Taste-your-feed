import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Store } from 'lucide-react';

export default function OwnerLogin() {
  const [email, setEmail] = useState('owner@labella.com');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const { ownerLogin } = useStore();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (ownerLogin(email, password)) {
      navigate('/owner/dashboard');
    } else { setError('Invalid credentials. Use demo: owner@labella.com / demo123'); }
  };

  return (
    <div className="h-full bg-dark flex flex-col items-center justify-center p-6">
      <div className="w-16 h-16 bg-amber/20 rounded-2xl flex items-center justify-center mb-6 text-amber"><Store size={32} /></div>
      <h1 className="text-3xl font-display font-bold mb-2 text-center">Owner Portal</h1>
      <p className="text-gray-400 mb-8 text-center">Manage your restaurant, reels, and orders.</p>
      <form onSubmit={handleLogin} className="w-full space-y-4">
        {error && <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded">{error}</p>}
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-dark-2 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber outline-none" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-dark-2 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-amber outline-none" />
        <button type="submit" className="w-full bg-amber text-white py-4 rounded-xl font-bold mt-4">Login to Dashboard</button>
      </form>
    </div>
  );
}