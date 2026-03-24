import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';

const Discover = () => {
  const { reels, fetchReels } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReels();
  }, [fetchReels]);

  // FIX: was filtering by reel.title — that field does NOT exist in the Reel schema.
  //      The correct field is reel.itemName. Search now checks itemName + shopName.
  const filteredReels = reels.filter(reel =>
    reel.itemName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    reel.shopName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white p-4 pb-24">
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md pt-4 pb-4">
        <h1 className="text-3xl font-black mb-4">Discover 🔍</h1>
        <input
          type="text"
          placeholder="Search for pizza, sushi, or chefs..."
          className="w-full bg-gray-900 border border-gray-800 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all text-white placeholder-gray-500"
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        {filteredReels.map((reel, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            key={reel._id}
            className="relative aspect-[9/16] bg-gray-900 rounded-xl overflow-hidden group cursor-pointer"
          >
            <video
              src={reel.videoUrl}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
              muted loop autoPlay playsInline
            />
            <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
              {/* FIX: was reel.title — correct field is reel.itemName */}
              <p className="font-bold text-sm truncate">{reel.itemName}</p>
              <p className="text-xs text-gray-300">@{reel.shopName}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReels.length === 0 && (
        <div className="text-center text-gray-500 mt-20">
          No food found {searchQuery ? `matching "${searchQuery}"` : '— upload some reels first!'}
        </div>
      )}
    </div>
  );
};

export default Discover;