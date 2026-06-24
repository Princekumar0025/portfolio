'use client';

import { Search, MapPin } from 'lucide-react';

export function HeroSearch() {
  return (
    <div className="w-full bg-white dark:bg-zinc-950 py-4 shadow-sm">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4 justify-between">
        
        {/* Brand & Location */}
        <div className="flex items-center gap-6 w-full md:w-auto">
          <h1 className="text-3xl font-black italic tracking-tighter text-red-500">swifty</h1>
          
          <div className="flex items-center gap-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 px-3 py-2 rounded-lg cursor-pointer transition-colors border-b-2 border-transparent hover:border-zinc-300">
            <MapPin size={18} className="text-red-500" />
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Delivering to</span>
              <span className="text-sm font-semibold truncate max-w-[150px]">Koramangala, Bangalore</span>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 w-full max-w-2xl">
          <div className="relative flex items-center w-full h-12 rounded-xl focus-within:shadow-lg bg-white dark:bg-zinc-900 overflow-hidden border border-zinc-200 dark:border-zinc-800 transition-shadow">
            <div className="grid place-items-center h-full w-12 text-zinc-400">
              <Search size={22} />
            </div>
            <input
              className="peer h-full w-full outline-none text-sm text-zinc-700 dark:text-zinc-200 pr-2 bg-transparent placeholder-zinc-400 font-medium"
              type="text"
              id="search"
              placeholder="Search for 'Biryani' or 'Burger King'" 
            />
          </div>
        </div>

        {/* Auth / Profile */}
        <div className="hidden md:flex items-center gap-4">
          <button className="text-zinc-600 dark:text-zinc-300 font-semibold hover:text-black dark:hover:text-white transition-colors">Log in</button>
          <button className="bg-black dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl font-bold hover:opacity-80 transition-opacity">Sign up</button>
        </div>

      </div>
    </div>
  );
}
