import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function OwnerUpload() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};
  const [loading, setLoading] = useState(false);

  // FIX: was calling addReel() from useStore — that function NEVER existed in
  //      useStore.js. Clicking "Publish Reel" always crashed immediately.
  //      Replaced with a real API call to POST /api/reels/upload, matching
  //      the backend reelRoutes.js exactly.
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    description: '',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user._id) return alert('Please log in again.');
    setLoading(true);

    try {
      // Send as JSON since this form uses a URL, not a file upload
      const res = await axios.post(`${API_BASE_URL}/api/reels/upload-url`, {
        itemName: formData.itemName,
        shopOwner: user._id,
        shopName: user.shopName || "Chef's Kitchen",
        price: parseFloat(formData.price),
        description: formData.description,
        videoUrl: formData.mediaUrl
      });

      if (res.status === 201 || res.status === 200) {
        alert('Reel Published! 🎬');
        navigate('/owner/dashboard');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to publish reel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full bg-dark overflow-y-auto pb-24 pt-6 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="glass-dark p-2 rounded-full"><ChevronLeft /></button>
        <h1 className="text-2xl font-display font-bold">New Reel</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full aspect-[9/16] max-h-64 bg-dark-2 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 mb-6">
          <Upload size={32} className="mb-2" />
          <span className="font-bold">Video Preview (URL below)</span>
        </div>
        <div>
          <label className="text-sm text-gray-400 ml-1">Video URL</label>
          <div className="relative mt-1">
            <LinkIcon className="absolute left-3 top-3 text-gray-500" size={18} />
            <input
              required type="url"
              value={formData.mediaUrl}
              onChange={e => setFormData({...formData, mediaUrl: e.target.value})}
              className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-amber"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-400 ml-1">Item Name</label>
          <input required type="text" placeholder="e.g. Smashburger"
            value={formData.itemName}
            onChange={e => setFormData({...formData, itemName: e.target.value})}
            className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 ml-1">Price (₹)</label>
          <input required type="number" step="0.01"
            value={formData.price}
            onChange={e => setFormData({...formData, price: e.target.value})}
            className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber mt-1"
          />
        </div>
        <div>
          <label className="text-sm text-gray-400 ml-1">Description</label>
          <textarea required rows="3"
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber mt-1 resize-none"
          />
        </div>
        <button
          type="submit" disabled={loading}
          className={`w-full py-4 rounded-xl font-bold mt-8 ${loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber text-white'}`}
        >
          {loading ? 'Publishing...' : 'Publish Reel'}
        </button>
      </form>
    </div>
  );
}