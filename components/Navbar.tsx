'use client';

import React from 'react';
import { Sparkles, Download, HelpCircle } from 'lucide-react';

interface NavbarProps {
  onOpenExport: () => void;
  onOpenInfoModal: () => void;
}

export function Navbar({ onOpenExport, onOpenInfoModal }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <Sparkles size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">
                NativeSplash
              </span>
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Hardware-accelerated animated splash screens for iOS, Android, Flutter & React Native
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenInfoModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent hover:border-slate-800 transition"
          >
            <HelpCircle size={14} />
            <span className="hidden sm:inline">Why Native?</span>
          </button>

          <button
            onClick={onOpenExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/25 transition active:scale-95"
          >
            <Download size={14} />
            <span>Export Native Files</span>
          </button>
        </div>
      </div>
    </header>
  );
}
