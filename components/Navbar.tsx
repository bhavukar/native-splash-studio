'use client';

import React from 'react';
import { Download, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenExport: () => void;
  onOpenInfoModal: () => void;
}

export function Navbar({ onOpenExport, onOpenInfoModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.06] bg-[#0A0A0C]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-13 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#18181B] border border-white/[0.08] flex items-center justify-center text-zinc-300">
            <Terminal size={14} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-tight text-zinc-200">
              native-splash
            </span>
            <span className="text-[10px] font-mono text-zinc-500 border border-zinc-800 rounded px-1.5 py-0.5">
              studio
            </span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenInfoModal}
            className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 rounded-md hover:bg-zinc-800/60 transition"
          >
            Architecture
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-medium text-xs transition active:scale-[0.98]"
          >
            <Download size={13} />
            <span>Export Code</span>
          </button>
        </div>
      </div>
    </header>
  );
}
