'use client';

import React from 'react';
import { X, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

interface WhyNativeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhyNativeModal({ isOpen, onClose }: WhyNativeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Zap size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Why Native Splash Screens Matter
              </h3>
              <p className="text-xs text-slate-400">
                The secret behind Tier-1 apps (Uber, Airbnb, Twitter, Netflix)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* The Wrong Way */}
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-xs uppercase tracking-wider">
              <AlertTriangle size={14} />
              <span>The Dart / JS Mistake</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Writing an animated splash in <code className="text-rose-300 font-mono">main.dart</code> or <code className="text-rose-300 font-mono">App.tsx</code> runs <strong>AFTER</strong> the VM boots.
            </p>
            <ul className="text-[11px] text-slate-400 space-y-1.5 list-disc list-inside">
              <li>Ugly 500ms-1200ms white or black flash</li>
              <li>Jarring stutter before animation starts</li>
              <li>Rejected by Apple Human Interface Guidelines</li>
            </ul>
          </div>

          {/* The Native Way */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <ShieldCheck size={14} />
              <span>Native OS Splash</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Executed directly by <strong>Android OS Window Manager</strong> and <strong>iOS SpringBoard</strong> at 120 FPS.
            </p>
            <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Fires on the exact millisecond user taps app icon</li>
              <li>Hardware-accelerated VectorDrawables & Swift</li>
              <li>Zero white flashes, seamless handoff to main UI</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition"
          >
            Got it, let&apos;s build!
          </button>
        </div>
      </div>
    </div>
  );
}
