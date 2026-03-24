import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Search as SearchIcon } from 'lucide-react';

export default function Search() {
  const reels = useStore((state) => state.reels);
  const [query, setQuery] = useState('');

  // FIX: was filtering by r.cafeName and r.cuisine — neither field exists in the
  //      Reel schema. Correct field is r.shopName. Cuisine is also not in schema.
  const filteredReels = reels.filter(r =>
    r.itemName?.toLowerCase().includes(query.toLowerCase()) ||
    r.shopName?.toLowerCase().includes(query.toLowerCase()) ||
    r.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="h-full bg-dark overflow-y-auto pb-24 pt-8 px-4">
      <h1 className="text-3xl font-display font-bold mb-6">Discover</h1>
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <SearchIcon className="text-gray-400" size={20} />
        </div>
        <input
          type="text"
          placeholder="Search food, cafes, cuisines..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-dark-2 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-amber transition-colors"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {filteredReels.map(reel => (
          // FIX: was using reel.id — MongoDB uses reel._id
          <div key={reel._id} className="relative rounded-2xl overflow-hidden aspect-[9/16] bg-dark-2 group">
            {/* FIX: was reel.mediaUrl — correct field is reel.videoUrl */}
            <video src={reel.videoUrl} className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-3 flex flex-col justify-end">
              <h3 className="font-bold text-sm leading-tight truncate">{reel.itemName}</h3>
              {/* FIX: was reel.cafeName — correct field is reel.shopName */}
              <p className="text-xs text-gray-300 truncate">@{reel.shopName}</p>
            </div>
          </div>
        ))}
        {filteredReels.length === 0 && (
          <div className="col-span-2 text-center text-gray-500 mt-10">No results found</div>
        )}
      </div>
    </div>
  );
}