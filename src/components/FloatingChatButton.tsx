import React, { useState } from 'react';
import { Send, X } from 'lucide-react';

export const FloatingChatButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Real-time assistance bubble tooltip */}
      {showTooltip && (
        <div className="hidden sm:flex items-center gap-2 bg-[#072b4f] text-white px-3.5 py-2 rounded-xl shadow-2xl border border-cyan-400/40 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-cyan-200">Online: Real-time customer assistance</span>
          <button 
            onClick={() => setShowTooltip(false)}
            className="text-slate-400 hover:text-white ml-1 p-0.5 cursor-pointer"
            aria-label="Dismiss tooltip"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Support Button - opens company Telegram channel in a new browser tab */}
      <a
        href="https://t.me/G_Tec_Technolog"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-[#0088cc] to-[#0072BC] hover:from-[#0077b5] hover:to-[#005FA0] text-white font-bold text-xs sm:text-sm rounded-full shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/20 cursor-pointer"
        aria-label="Chat with Support on Telegram (opens in new tab)"
        title="Chat with Support on Telegram (Opens in new tab)"
      >
        <div className="relative">
          <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0088cc]"></span>
        </div>
        <span className="tracking-wide whitespace-nowrap">Chat with Support</span>
      </a>
    </div>
  );
};
