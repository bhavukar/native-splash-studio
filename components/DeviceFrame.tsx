'use client';

import React from 'react';
import { StudioConfig } from '../lib/types';
import { AnimationCanvas } from './AnimationCanvas';
import { isColorLight, getAdaptiveThemeColors } from '../lib/colors';
import { Sun, Moon, RotateCcw, Smartphone, Play, Zap } from 'lucide-react';

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
  const isBgLight = isColorLight(config.backgroundColor);
  const isDark = !isBgLight;
  const isIphone = config.device === 'iphone';

  const handleToggleOsMode = () => {
    const nextMode = isDark ? 'light' : 'dark';
    const nextColors = getAdaptiveThemeColors(nextMode, config.accentColor);
    onConfigChange({
      themeMode: nextMode,
      backgroundColor: nextColors.backgroundColor,
      accentColor: nextColors.accentColor,
    });
  };

  return (
    <div className="flex flex-col items-center justify-between w-full h-full max-w-md mx-auto">
      {/* Top Subtle Info Tag */}
      <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-zinc-400 dark:text-zinc-500">
        <span className="flex items-center gap-1">
          <Zap size={11} className="text-amber-400" />
          ProMotion 120Hz
        </span>
        <span>•</span>
        <span>{isIphone ? 'Apple SpringBoard Native' : 'Android WindowManager'}</span>
      </div>

      {/* Device Frame */}
      <div className="relative select-none my-auto transition-transform duration-200">
        {isIphone ? (
          /* iPhone 16 Pro Titanium Frame */
          <div className="relative w-[280px] h-[570px] bg-[#1C1C1E] rounded-[44px] p-[6px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-black flex flex-col">
              {/* iOS Status Bar */}
              <div className="absolute top-0 inset-x-0 h-9 z-40 flex items-center justify-between px-5 pt-1 pointer-events-none">
                <span
                  className={`text-[11px] font-semibold transition-colors duration-200 ${
                    isBgLight ? 'text-zinc-950 font-bold' : 'text-zinc-200'
                  }`}
                >
                  9:41
                </span>

                {/* Dynamic Island with camera lens reflection */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[76px] h-[20px] bg-black rounded-full flex items-center justify-between px-2 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-white/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0d]" />
                </div>

                <div
                  className={`flex items-center gap-1.5 transition-colors duration-200 ${
                    isBgLight ? 'text-zinc-950 font-semibold' : 'text-zinc-200'
                  }`}
                >
                  <span className="text-[9px] font-mono">5G</span>
                  <div
                    className={`w-3.5 h-2 rounded-[2.5px] border p-[1px] ${
                      isBgLight ? 'border-zinc-950' : 'border-zinc-400'
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-[1px] ${
                        isBgLight ? 'bg-zinc-950' : 'bg-zinc-200'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Viewport Canvas */}
              <div className="relative flex-1 w-full h-full">
                <AnimationCanvas
                  config={config}
                  isPlaying={scrubProgress === null}
                  scrubProgress={scrubProgress}
                  replayNonce={replayNonce}
                />
              </div>

              {/* iOS Home Indicator */}
              <div className="absolute bottom-1 inset-x-0 flex justify-center pointer-events-none z-40">
                <div
                  className={`w-24 h-1 rounded-full transition-colors duration-200 ${
                    isBgLight ? 'bg-black/40' : 'bg-white/40'
                  }`}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Pixel 9 Frame */
          <div className="relative w-[280px] h-[570px] bg-[#161618] rounded-[38px] p-[6px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.08)]">
            <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black flex flex-col">
              {/* Android Status Bar */}
              <div className="absolute top-0 inset-x-0 h-8 z-40 flex items-center justify-between px-4 pt-1 pointer-events-none">
                <span
                  className={`text-[10px] font-mono transition-colors duration-200 ${
                    isBgLight ? 'text-zinc-950 font-bold' : 'text-zinc-300'
                  }`}
                >
                  09:41
                </span>
                <div className="absolute left-1/2 -translate-x-1/2 top-2 w-2.5 h-2.5 rounded-full bg-[#0a0a0d] border border-white/10" />
                <span
                  className={`text-[9px] font-mono transition-colors duration-200 ${
                    isBgLight ? 'text-zinc-950 font-bold' : 'text-zinc-300'
                  }`}
                >
                  100%
                </span>
              </div>

              {/* Viewport Canvas */}
              <div className="relative flex-1 w-full h-full">
                <AnimationCanvas
                  config={config}
                  isPlaying={scrubProgress === null}
                  scrubProgress={scrubProgress}
                  replayNonce={replayNonce}
                />
              </div>

              {/* Android Gesture Bar */}
              <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-40">
                <div
                  className={`w-16 h-1 rounded-full transition-colors duration-200 ${
                    isBgLight ? 'bg-black/40' : 'bg-white/40'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Glass Playback Dock */}
      <div className="w-full max-w-[380px] mt-2 bg-zinc-900/95 dark:bg-zinc-900/95 text-zinc-100 border border-white/10 backdrop-blur-xl rounded-xl p-2.5 shadow-2xl">
        {/* Timeline Scrub Track */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onReplay}
            className="flex items-center justify-center w-7 h-7 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 transition active:scale-95 flex-shrink-0"
            title="Replay Animation (Space)"
          >
            <RotateCcw size={13} />
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.005"
            value={scrubProgress ?? 1}
            onChange={(e) => onScrubChange(parseFloat(e.target.value))}
            className="flex-1 h-1.5 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-300"
          />

          <span className="text-[10px] font-mono text-zinc-400 w-16 text-right flex-shrink-0">
            {scrubProgress !== null
              ? `${Math.round(scrubProgress * config.durationMs)}ms`
              : `${config.durationMs}ms`}
          </span>

          <button
            onClick={() => onScrubChange(null)}
            className={`text-[9px] font-mono px-1.5 py-0.5 rounded transition ${
              scrubProgress === null
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Live
          </button>
        </div>

        {/* Studio Controls Row */}
        <div className="flex items-center justify-between pt-1.5 border-t border-white/10 text-xs">
          {/* Device Toggle */}
          <div className="flex items-center bg-zinc-800/80 p-0.5 rounded-lg border border-white/5">
            <button
              onClick={() => onConfigChange({ device: 'iphone' })}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                isIphone ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              iPhone
            </button>
            <button
              onClick={() => onConfigChange({ device: 'pixel' })}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                !isIphone ? 'bg-zinc-700 text-white font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Pixel
            </button>
          </div>

          {/* Speed Chips */}
          <div className="flex items-center bg-zinc-800/80 p-0.5 rounded-lg border border-white/5">
            {[0.5, 1.0, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                  playbackSpeed === speed
                    ? 'bg-zinc-700 text-white font-bold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* OS Theme Mode */}
          <button
            onClick={handleToggleOsMode}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-zinc-800/80 border border-white/5 text-[10px] text-zinc-300 hover:text-white hover:bg-zinc-700 transition"
            title="Toggle Device OS Theme"
          >
            {isDark ? <Moon size={11} className="text-zinc-400" /> : <Sun size={11} className="text-amber-400" />}
            <span>OS: {isDark ? 'Dark' : 'Light'}</span>
          </button>

          {/* Handoff Toggle */}
          <button
            onClick={() => onConfigChange({ showHomeScreenHandoff: !config.showHomeScreenHandoff })}
            className={`px-2 py-1 rounded-lg text-[10px] font-medium transition border ${
              config.showHomeScreenHandoff
                ? 'bg-zinc-700 border-zinc-500 text-white'
                : 'bg-zinc-800/80 border-white/5 text-zinc-400 hover:text-white'
            }`}
          >
            Handoff
          </button>
        </div>
      </div>
    </div>
  );
}
