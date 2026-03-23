import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// THIS WAS MISSING:
import { API_BASE_URL } from '../config'; 

const UploadReel = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};
  const [loading, setLoading] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    price: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety Checks
    if (!videoFile) return alert("Please select a video!");
    if (!user._id) return alert("User ID missing. Please log out and back in.");

    setLoading(true);
    const data = new FormData();
    data.append('video', videoFile);
    data.append('itemName', formData.itemName);
    data.append('shopOwner', user._id); 
    data.append('shopName', user.shopName || "Chef's Kitchen");
    data.append('price', formData.price);
    data.append('description', formData.description);

    try {
      console.log("📤 Sending to:", `${API_BASE_URL}/api/reels/upload`);
      
      const res = await axios.post(`${API_BASE_URL}/api/reels/upload`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Handle both 200 and 201 success codes
      if (res.status === 201 || res.status === 200) {
        alert("Reel Posted Successfully! 🎬");
        navigate('/feed');
      }
    } catch (err) {
      // Improved error logging to catch the "undefined" issue
      console.error("❌ Upload Error Details:", err.response || err);
      
      const errorMessage = err.response?.data?.error || err.message || "Network error. Check if backend is running.";
      alert(`Upload failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-black text-white p-6 pb-24 flex flex-col items-center">
      <h1 className="text-3xl font-black mb-8 text-orange-500 italic tracking-tighter">NEW REEL</h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        {/* Video Selector Dropzone */}
        <div className="relative group border-2 border-dashed border-gray-800 rounded-3xl p-8 text-center bg-gray-900/50 hover:border-orange-500/50 transition-all">
          <input 
            type="file" accept="video/*" 
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
            id="videoInput"
          />
          <div className="space-y-2">
            {videoFile ? (
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-2">✅</span>
                <span className="text-green-400 font-bold text-xs truncate max-w-[200px]">
                  {videoFile.name}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center py-4">
                <span className="text-3xl mb-2">📹</span>
                <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Select Video (MP4)</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <input 
            type="text" placeholder="Dish name (e.g. Spicy Ramen)" required
            className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all"
            onChange={(e) => setFormData({...formData, itemName: e.target.value})}
          />

          <input 
            type="number" placeholder="Price (₹)" required
            className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all"
            onChange={(e) => setFormData({...formData, price: e.target.value})}
          />

          <textarea 
            placeholder="Tell us about the flavor..."
            className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl outline-none focus:border-orange-500 h-28 transition-all resize-none"
            onChange={(e) => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <button 
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-black text-black uppercase tracking-tighter transition-all shadow-xl shadow-orange-500/10 ${
            loading ? "bg-gray-700 cursor-not-allowed grayscale" : "bg-orange-500 active:scale-95 hover:bg-orange-400"
          }`}
        >
          {loading ? "Uploading to Cloud..." : "Share to Feed 🚀"}
        </button>
      </form>
    </div>
  );
};

export default UploadReel;