'use client';

import Image from 'next/image';
import { Star, Clock } from 'lucide-react';
import Link from 'next/link';

interface Props {
  id: string;
  name: string;
  rating: number;
  timeEstimate: string;
  cuisines: string[];
  imageUrl: string;
  offer?: string;
}

export function RestaurantCard({ id, name, rating, timeEstimate, cuisines, imageUrl, offer }: Props) {
  return (
    <Link href={`/restaurant/${id}`} className="group cursor-pointer relative rounded-2xl overflow-hidden transition-transform hover:scale-[1.02] block shadow-sm border border-zinc-100 hover:shadow-lg bg-white">
      {/* Aspect Ratio Image Wrapper */}
      <div className="relative w-full aspect-[4/3] bg-zinc-100">
        <Image 
          src={imageUrl} 
          alt={name} 
          fill 
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Dark Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Offer Tag */}
        {offer && (
          <div className="absolute bottom-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-black uppercase tracking-wider shadow-md">
            {offer}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-white dark:bg-zinc-900">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 truncate pr-2">{name}</h3>
          <span className="flex items-center gap-1 bg-green-700 text-white px-1.5 py-0.5 rounded text-xs font-bold shadow-sm whitespace-nowrap">
            {rating} <Star size={10} fill="currentColor" />
          </span>
        </div>
        
        <p className="text-sm text-zinc-500 truncate mt-1">{cuisines.join(', ')}</p>
        
        <div className="flex items-center gap-3 mt-3 text-xs text-zinc-600 dark:text-zinc-400 font-medium">
          <span className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full">
            <Clock size={12} /> {timeEstimate}
          </span>
          <span>• ₹200 for one</span>
        </div>
      </div>
    </Link>
  );
}
