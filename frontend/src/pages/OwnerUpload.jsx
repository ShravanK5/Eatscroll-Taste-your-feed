import { useState } from 'react';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Upload, Link as LinkIcon } from 'lucide-react';

export default function OwnerUpload() {
  const navigate = useNavigate();
  const { addReel } = useStore();
  const [formData, setFormData] = useState({ itemName: '', price: '', cuisine: '', description: '', mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addReel({ cafeId: 'c1', cafeName: 'La Bella', itemName: formData.itemName, price: parseFloat(formData.price), cuisine: formData.cuisine, description: formData.description, mediaUrl: formData.mediaUrl });
    navigate('/owner/dashboard');
  };

  return (
    <div className="h-full bg-dark overflow-y-auto pb-24 pt-6 px-4">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="glass-dark p-2 rounded-full"><ChevronLeft /></button>
        <h1 className="text-2xl font-display font-bold">New Reel</h1>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="w-full aspect-[9/16] max-h-64 bg-dark-2 rounded-2xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center text-gray-500 mb-6"><Upload size={32} className="mb-2" /><span className="font-bold">Upload MP4</span></div>
        <div>
          <label className="text-sm text-gray-400 ml-1">Video URL (For Prototype)</label>
          <div className="relative mt-1"><LinkIcon className="absolute left-3 top-3 text-gray-500" size={18} /><input required type="url" value={formData.mediaUrl} onChange={e => setFormData({...formData, mediaUrl: e.target.value})} className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white focus:border-amber" /></div>
        </div>
        <div><label className="text-sm text-gray-400 ml-1">Item Name</label><input required type="text" placeholder="e.g. Smashburger" value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber mt-1" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-400 ml-1">Price ($)</label><input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber mt-1" /></div>
          <div>
            <label className="text-sm text-gray-400 ml-1">Cuisine</label>
            <select required value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber mt-1 appearance-none">
              <option value="" disabled>Select...</option><option value="Italian">Italian</option><option value="Japanese">Japanese</option><option value="Burgers">Burgers</option>
            </select>
          </div>
        </div>
        <div><label className="text-sm text-gray-400 ml-1">Description</label><textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-dark-2 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-amber mt-1 resize-none" /></div>
        <button type="submit" className="w-full bg-amber text-white py-4 rounded-xl font-bold mt-8">Publish Reel</button>
      </form>
    </div>
  );
}