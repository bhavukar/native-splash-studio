'use client';

import React from 'react';
import { X } from 'lucide-react';

interface WhyNativeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhyNativeModal({ isOpen, onClose }: WhyNativeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-[#0E0E11] border border-white/[0.08] rounded-xl p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <span className="text-xs font-semibold text-zinc-200">
            Native OS vs Dart/JS Splash Architecture
          </span>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded text-zinc-500 hover:text-zinc-200 flex items-center justify-center transition"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-xs text-zinc-400 leading-relaxed">
          <div className="p-3 rounded-lg bg-[#141417] border border-white/[0.04]">
            <span className="text-zinc-200 font-medium block mb-1">
              The Dart / JS Runtime Delay
            </span>
            <p className="text-[11px] text-zinc-500">
              When an animated splash is written inside <code className="text-zinc-400 font-mono">main.dart</code> or <code className="text-zinc-400 font-mono">App.tsx</code>, the OS first displays a static window while the engine (Flutter Engine or Hermes/V8) compiles. This causes a 500ms–1500ms blank delay before animation starts.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#141417] border border-white/[0.04]">
            <span className="text-zinc-200 font-medium block mb-1">
              Hardware-Accelerated Native OS Splash
            </span>
            <p className="text-[11px] text-zinc-500">
              NativeSplash Studio generates Android 12+ <code className="text-zinc-400 font-mono">AnimatedVectorDrawable</code> (AVD) and iOS <code className="text-zinc-400 font-mono">LaunchScreen.storyboard</code> + Swift controllers that execute at the window manager level at 120 FPS the instant the user taps your app icon.
            </p>
          </div>
        </div>

        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
