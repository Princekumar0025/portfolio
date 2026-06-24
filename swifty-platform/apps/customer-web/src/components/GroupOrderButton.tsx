'use client';

import React, { useState } from 'react';
import { Users, Link as LinkIcon, CheckCircle2 } from 'lucide-react';

interface Props {
  restaurantId: string;
  restaurantName: string;
}

export function GroupOrderButton({ restaurantId, restaurantName }: Props) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [groupLink, setGroupLink] = useState('');

  const handleCreateGroup = () => {
    setIsGenerating(true);
    // Simulate API Call to create a WebSocket group session
    setTimeout(() => {
      const sessionId = Math.random().toString(36).substring(2, 10);
      setGroupLink(`https://swifty.com/group/${restaurantId}?session=${sessionId}`);
      setIsGenerating(false);
    }, 1200);
  };

  return (
    <div className="bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 rounded-2xl p-5 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-2">
            <Users size={20} /> Host a Group Order for {restaurantName}
          </h3>
          <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 mt-1 max-w-md">
            Save up to 40% on delivery fees! Share a link with your coworkers or roommates to build a single cart together in real-time.
          </p>
        </div>

        {groupLink ? (
          <div className="w-full md:w-auto flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-800 px-3 py-2 rounded-lg">
              <code className="text-xs font-mono text-zinc-600 dark:text-zinc-400 select-all">{groupLink}</code>
              <button 
                onClick={() => navigator.clipboard.writeText(groupLink)}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 transition-colors"
                title="Copy Link"
              >
                <LinkIcon size={16} />
              </button>
            </div>
            <span className="text-xs font-bold text-green-600 flex items-center gap-1">
              <CheckCircle2 size={12} /> Active for 20 minutes
            </span>
          </div>
        ) : (
          <button 
            onClick={handleCreateGroup}
            disabled={isGenerating}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center"
          >
            {isGenerating ? 'Generating Link...' : 'Start Group Order'}
          </button>
        )}
      </div>
    </div>
  );
}
