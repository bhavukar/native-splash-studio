'use client';

import React from 'react';
import { StudioConfig } from '../lib/types';
import { AnimationCanvas } from './AnimationCanvas';
import { RotateCcw, Eye } from 'lucide-react';

interface DeviceFrameProps {
  config: StudioConfig;
  onConfigChange: (updates: Partial<StudioConfig>) => void;
  replayNonce: number;
  onReplay: () => void;
  playbackSpeed: number;
  onSpeedChange: (speed: number) => void;
  scrubProgress: number | null;
  onScrubChange: (progress: number | null) => void;
}

export function DeviceFrame({
  config,
  onConfigChange,
  replayNonce,
  onReplay,
  playbackSpeed,
  onSpeedChange,
  scrubProgress,
  onScrubChange,
}: DeviceFrameProps) {
  const isDark = config.themeMode === 'dark';
  const isIphone = config.device === 'iphone';

  return (
    <div className="flex flex-col items-center">
      {/* Top Device Toolbar */}
      <div className="flex items-center gap-3 mb-6 bg-slate-900/80 border border-slate-800 rounded-full px-4 py-1.5 shadow-lg backdrop-blur-md">
        {/* Device Switcher */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-full border border-slate-700/60">
          <button
            onClick={() => onConfigChange({ device: 'iphone' })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              isIphone
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            iPhone 16 Pro
          </button>
          <button
            onClick={() => onConfigChange({ device: 'pixel' })}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              !isIphone
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Google Pixel 9
          </button>
        </div>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-slate-800" />

        {/* Theme Mode Switcher */}
        <button
          onClick={() =>
            onConfigChange({
              themeMode: isDark ? 'light' : 'dark',
              backgroundColor: isDark ? '#FFFFFF' : '#0B0F19',
            })
          }
          className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white px-2.5 py-1 rounded-full bg-slate-800/50 hover:bg-slate-800 transition"
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: isDark ? '#38BDF8' : '#F59E0B' }} />
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </button>

        {/* Separator */}
        <div className="w-[1px] h-4 bg-slate-800" />

        {/* Handoff Preview Toggle */}
        <button
          onClick={() =>
            onConfigChange({
              showHomeScreenHandoff: !config.showHomeScreenHandoff,
            })
          }
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition ${
            config.showHomeScreenHandoff
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'text-slate-400 hover:text-slate-200 bg-slate-800/40'
          }`}
          title="Simulate seamless cross-dissolve to main app"
        >
          <Eye size={12} />
          <span>App Handoff</span>
        </button>
      </div>

      {/* The Physical Device Mockup */}
      <div className="relative select-none transition-all duration-300">
        {/* Glow ambient background aura */}
        <div
          className="absolute -inset-4 rounded-[60px] opacity-25 blur-3xl pointer-events-none transition-all duration-500"
          style={{
            background: `radial-gradient(circle, ${config.accentColor} 0%, transparent 70%)`,
          }}
        />

        {isIphone ? (
          /* ================= iPhone 16 Pro Frame ================= */
          <div className="relative w-[340px] h-[700px] bg-[#222124] rounded-[52px] p-[10px] shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_0_4px_rgba(255,255,255,0.4)] border-2 border-[#444247]">
            {/* Outer Titanium Bezel Accent */}
            <div className="relative w-full h-full rounded-[44px] overflow-hidden bg-black shadow-inner flex flex-col">
              {/* iOS Status Bar */}
              <div className="absolute top-0 inset-x-0 h-11 z-40 flex items-center justify-between px-7 pt-2 pointer-events-none">
                {/* Time */}
                <span className="text-[13px] font-semibold tracking-tight text-white/90">
                  9:41
                </span>

                {/* Dynamic Island */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-[96px] h-[26px] bg-black rounded-full flex items-center justify-between px-2.5 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#111116] border border-white/5" />
                  <div className="w-2 h-2 rounded-full bg-[#111116] border border-blue-500/20" />
                </div>

                {/* Right Status Icons */}
                <div className="flex items-center gap-1.5 text-white/90">
                  <span className="text-[10px] font-bold tracking-tight">5G</span>
                  {/* Wi-Fi Icon */}
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.5c3.6 0 6.9 1.4 9.3 3.7L12 19.3 2.7 11.2C5.1 8.9 8.4 7.5 12 7.5z" />
                  </svg>
                  {/* Battery Pill */}
                  <div className="w-5 h-2.5 rounded-[4px] border border-white/70 p-[1px] flex items-center">
                    <div className="w-full h-full bg-white rounded-[2px]" />
                  </div>
                </div>
              </div>

              {/* Splash Animation Screen Viewport */}
              <div className="relative flex-1 w-full h-full">
                <AnimationCanvas
                  config={config}
                  isPlaying={scrubProgress === null}
                  scrubProgress={scrubProgress}
                  replayNonce={replayNonce}
                />
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-40">
                <div className="w-32 h-1 bg-white/50 rounded-full" />
              </div>
            </div>
          </div>
        ) : (
          /* ================= Google Pixel 9 Frame ================= */
          <div className="relative w-[340px] h-[700px] bg-[#1a1b1e] rounded-[44px] p-[9px] shadow-[0_25px_70px_rgba(0,0,0,0.8),inset_0_0_3px_rgba(255,255,255,0.3)] border-2 border-[#373940]">
            <div className="relative w-full h-full rounded-[36px] overflow-hidden bg-black shadow-inner flex flex-col">
              {/* Android Status Bar */}
              <div className="absolute top-0 inset-x-0 h-10 z-40 flex items-center justify-between px-6 pt-1 pointer-events-none">
                {/* Android Clock */}
                <span className="text-[12px] font-medium text-white/90">
                  09:41
                </span>

                {/* Centered Camera Punch Hole */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3.5 h-3.5 rounded-full bg-[#0a0a0d] border border-white/10" />

                {/* Android Icons */}
                <div className="flex items-center gap-1.5 text-white/90">
                  <span className="text-[10px] font-mono">LTE</span>
                  <div className="w-3.5 h-3.5 border-b-2 border-r-2 border-white/80 rotate-45 scale-75" />
                  <span className="text-[10px] font-medium">100%</span>
                </div>
              </div>

              {/* Splash Animation Viewport */}
              <div className="relative flex-1 w-full h-full">
                <AnimationCanvas
                  config={config}
                  isPlaying={scrubProgress === null}
                  scrubProgress={scrubProgress}
                  replayNonce={replayNonce}
                />
              </div>

              {/* Android Gesture Bar */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center pointer-events-none z-40">
                <div className="w-20 h-1 bg-white/60 rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Playback & Timeline Controls */}
      <div className="w-full max-w-[340px] mt-6 bg-slate-900/90 border border-slate-800 rounded-2xl p-3 shadow-xl backdrop-blur-md">
        {/* Timeline Scrub Slider */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-mono text-slate-400 w-8">
            {scrubProgress !== null
              ? `${Math.round(scrubProgress * config.durationMs)}ms`
              : 'LIVE'}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={scrubProgress ?? 1}
            onChange={(e) => onScrubChange(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <button
            onClick={() => onScrubChange(null)}
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              scrubProgress === null
                ? 'bg-blue-600/30 text-blue-400'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            title="Resume Live Animation"
          >
            Auto
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
          {/* Replay Button */}
          <button
            onClick={onReplay}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-md shadow-blue-600/30 transition active:scale-95"
          >
            <RotateCcw size={13} />
            <span>Replay (Space)</span>
          </button>

          {/* Speed Controls */}
          <div className="flex items-center bg-slate-800/70 p-0.5 rounded-lg border border-slate-700/50">
            {[0.5, 1.0, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-2 py-1 rounded text-[11px] font-mono transition ${
                  playbackSpeed === speed
                    ? 'bg-slate-700 text-white font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
