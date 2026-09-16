import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ title = 'No Data Found', message = 'There are currently no items to display.', onAction, actionLabel }) {
  return (
    <div className="teal-glass-card p-8 rounded-3xl text-center space-y-4 flex flex-col items-center justify-center">
      <div className="w-14 h-14 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-400">
        <FolderOpen className="w-8 h-8" />
      </div>
      <div>
        <h4 className="text-lg font-black text-white">{title}</h4>
        <p className="text-xs text-emerald-200/60 font-semibold max-w-sm mt-1">{message}</p>
      </div>
      {onAction && actionLabel && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-black emerald-btn rounded-xl shadow-md transition cursor-pointer"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
