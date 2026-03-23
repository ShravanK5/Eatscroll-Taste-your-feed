import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Heart, ShoppingBag } from 'lucide-react';

export default function Feed() {
  const { reels, placeOrder, toggleLike, userLikes } = useStore();

  return (
    <div className="h-[100dvh] w-full bg-black overflow-y-scroll snap-y snap-mandatory hide-scrollbar">
      {reels.map((reel) => (
        <ReelItem 
          key={reel._id} 
          reel={reel} 
          onOrder={() => placeOrder(reel)} 
          toggleLike={toggleLike}
          userLikes={userLikes}
        />
      ))}
    </div>
  );
}

function ReelItem({ reel, onOrder, toggleLike, userLikes }) {
  const videoRef = useRef(null);
  const [isAdded, setIsAdded] = useState(false);
  const isLiked = userLikes?.includes(reel._id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) videoRef.current?.play().catch(() => {});
        else videoRef.current?.pause();
      }, { threshold: 0.7 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-[100dvh] w-full snap-start bg-black">
      <video ref={videoRef} src={reel.videoUrl} className="h-full w-full object-cover" loop muted playsInline />
      
      <div className="absolute right-4 bottom-32 z-20">
        <button onClick={() => toggleLike(reel._id)} className="p-3 bg-white/10 rounded-full">
          <Heart size={28} fill={isLiked ? "red" : "none"} className="text-white" />
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 pb-28 bg-gradient-to-t from-black z-10 pointer-events-none">
        <div className="pointer-events-auto">
          <h3 className="text-white font-black text-xl">@{reel.shopName}</h3>
          <p className="text-gray-300 mb-4">{reel.itemName}</p>
          
          <button 
            onClick={async (e) => {
              e.stopPropagation();
              const success = await onOrder(); 
              if (success) {
                setIsAdded(true);
                setTimeout(() => setIsAdded(false), 2000);
              }
            }}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black transition-all ${
              isAdded ? 'bg-green-500 text-white' : 'bg-orange-500 text-black'
            }`}
          >
            <ShoppingBag size={20} />
            {isAdded ? 'SENT TO CHEF ✅' : `ORDER FOR ₹${reel.price}`}
          </button>
        </div>
      </div>
    </div>
  );
}