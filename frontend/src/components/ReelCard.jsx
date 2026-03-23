import React, { useRef, useState } from 'react';
import socket from '../socket'; // 📞 Import your walkie-talkie!

const ReelCard = ({ reel }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isOrdering, setIsOrdering] = useState(false);

  // Pause/Play when the user taps the screen
  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 🚀 The Magic Live Order Function
  const handleOrder = () => {
    setIsOrdering(true);

    // 1. Package the order details
    const orderData = {
      reelId: reel._id,
      shopOwner: reel.shopOwner,
      shopName: reel.shopName,
      itemName: reel.itemName,
      price: reel.price,
      customerName: "Guest User", // We will hardcode this until you build a login!
      timestamp: new Date().toISOString()
    };

    // 2. Beam it instantly to the backend server!
    socket.emit('place-order', orderData);

    // 3. Give the user some visual feedback
    setTimeout(() => {
      setIsOrdering(false);
      alert(`🛒 SUCCESS! Your order for the ${reel.itemName} has been sent directly to ${reel.shopName}!`);
    }, 600);
  };

  return (
    <div className="relative w-full h-full bg-black max-w-md mx-auto">
      {/* The Video Player */}
      <video
        ref={videoRef}
        src={reel.videoUrl} 
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted 
        onClick={togglePlay}
        playsInline
      />
      
      {/* The Text Overlay */}
      <div className="absolute bottom-24 left-4 text-white z-10 pointer-events-none">
        <h2 className="text-2xl font-bold drop-shadow-md">{reel.shopName}</h2>
        <h3 className="text-xl text-green-400 font-bold drop-shadow-md">${reel.price}</h3>
        <p className="text-lg mt-1 font-semibold drop-shadow-md">{reel.itemName}</p>
        <p className="text-sm text-gray-200 mt-2 max-w-[250px] drop-shadow-md">{reel.description}</p>
      </div>

      {/* The Action Buttons (Order Button) */}
      <div className="absolute bottom-24 right-4 flex flex-col items-center gap-6 z-10">
         <button 
            onClick={handleOrder}
            disabled={isOrdering}
            className={`w-14 h-14 rounded-full text-black text-2xl flex items-center justify-center shadow-lg transition transform hover:scale-105 ${
              isOrdering ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-400'
            }`}
          >
            {isOrdering ? '⏳' : '🛒'}
         </button>
      </div>
    </div>
  );
};

export default ReelCard;