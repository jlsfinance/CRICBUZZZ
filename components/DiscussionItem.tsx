
import React from 'react';
import { DiscussionThread } from '../types';
import { ArrowBigUp, ArrowBigDown, MessageSquare } from 'lucide-react';

export const DiscussionItem: React.FC<{ thread: DiscussionThread }> = ({ thread }) => {
  return (
    <div className="glass-panel rounded-xl p-4 flex gap-4 hover:bg-slate-800/50 transition-colors">
      <div className="flex flex-col items-center gap-1">
        <button className="text-slate-500 hover:text-green-500"><ArrowBigUp size={20} /></button>
        <span className="text-xs font-bold">{thread.upvotes}</span>
        <button className="text-slate-500 hover:text-red-500"><ArrowBigDown size={20} /></button>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-1 font-semibold">
           <span className="text-slate-300">u/{thread.author}</span>
           <span>•</span>
           <span>{thread.timestamp}</span>
        </div>
        <h3 className="font-bold text-sm mb-1 leading-snug">{thread.title}</h3>
        <p className="text-xs text-slate-400 line-clamp-2">{thread.content}</p>
        <div className="flex items-center gap-3 mt-3 text-slate-500">
           <div className="flex items-center gap-1 text-[10px] font-bold">
             <MessageSquare size={14} />
             {thread.commentsCount} Comments
           </div>
           <span className="text-[10px] font-bold hover:text-slate-300 cursor-pointer">Share</span>
        </div>
      </div>
    </div>
  );
};
