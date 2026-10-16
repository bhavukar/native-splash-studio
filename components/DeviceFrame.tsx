'use client';

import React from 'react';
import { StudioConfig } from '../lib/types';
import { AnimationCanvas } from './AnimationCanvas';
import { isColorLight, getAdaptiveThemeColors } from '../lib/colors';
import { Sun, Moon, RotateCcw } from 'lucide-react';

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
    <div className="flex flex-col items-center justify-between w-full h-full max-w-sm mx-auto">
      {/* Device Frame */}
      <div className="relative select-none my-auto transition-transform duration-150">
        {isIphone ? (
          /* iPhone Frame */
          <div className="relative w-[275px] h-[560px] bg-zinc-950 rounded-[44px] p-[6px] shadow-xl ring-1 ring-zinc-300 dark:ring-zinc-800">
            <div className="relative w-full h-full rounded-[38px] overflow-hidden bg-black flex flex-col">
              {/* iOS Status Bar */}
              <div className="absolute top-0 inset-x-0 h-9 z-40 flex items-center justify-between px-5 pt-1 pointer-events-none">
                <span
                  className={`text-[11px] font-semibold transition-colors duration-150 ${
                    isBgLight ? 'text-zinc-950 font-bold' : 'text-zinc-200'
                  }`}
                >
                  9:41
                </span>

                {/* Dynamic Island */}
                <div className="absolute left-1/2 -translate-x-1/2 top-1.5 w-[72px] h-[19px] bg-black rounded-full flex items-center justify-between px-2">
                  <div className="w-2 h-2 rounded-full bg-[#111] ring-1 ring-white/10" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0a0a0d]" />
                </div>

                <div
                  className={`flex items-center gap-1.5 transition-colors duration-150 ${
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
                  className={`w-24 h-1 rounded-full transition-colors duration-150 ${
                    isBgLight ? 'bg-black/30' : 'bg-white/30'
                  }`}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Pixel Frame */
          <div className="relative w-[275px] h-[560px] bg-zinc-950 rounded-[38px] p-[6px] shadow-xl ring-1 ring-zinc-300 dark:ring-zinc-800">
            <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black flex flex-col">
              {/* Android Status Bar */}
              <div className="absolute top-0 inset-x-0 h-8 z-40 flex items-center justify-between px-4 pt-1 pointer-events-none">
                <span
                  className={`text-[10px] font-mono transition-colors duration-150 ${
                    isBgLight ? 'text-zinc-950 font-bold' : 'text-zinc-300'
                  }`}
                >
                  09:41
                </span>

                {/* Center Hole Punch Camera */}
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] ring-1 ring-white/10" />

                <div
                  className={`flex items-center gap-1 transition-colors duration-150 ${
                    isBgLight ? 'text-zinc-950 font-bold' : 'text-zinc-300'
                  }`}
                >
                  <span className="text-[9px] font-mono">100%</span>
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

              {/* Android Gesture Bar */}
              <div className="absolute bottom-1.5 inset-x-0 flex justify-center pointer-events-none z-40">
                <div
                  className={`w-16 h-1 rounded-full transition-colors duration-150 ${
                    isBgLight ? 'bg-black/30' : 'bg-white/30'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Clean Playback Controls */}
      <div className="w-full max-w-[360px] mt-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 shadow-sm">
        {/* Scrubber Row */}
        <div className="flex items-center gap-2 mb-2">
          <button
            onClick={onReplay}
            className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition active:scale-95 flex-shrink-0"
            title="Replay (Space)"
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
            className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-sm appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
          />

          <span className="text-[10px] font-mono text-zinc-500 w-12 text-right flex-shrink-0">
            {scrubProgress !== null
              ? `${Math.round(scrubProgress * config.durationMs)}ms`
              : `${config.durationMs}ms`}
          </span>

          <button
            onClick={() => onScrubChange(null)}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded transition ${
              scrubProgress === null
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
            }`}
          >
            Live
          </button>
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          {/* Device Toggle */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-md">
            <button
              onClick={() => onConfigChange({ device: 'iphone' })}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                isIphone
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              iPhone
            </button>
            <button
              onClick={() => onConfigChange({ device: 'pixel' })}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                !isIphone
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Pixel
            </button>
          </div>

          {/* Speed Chips */}
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-md">
            {[0.5, 1.0, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                  playbackSpeed === speed
                    ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 font-bold shadow-xs'
                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>

          {/* Device OS Theme Toggle */}
          <button
            onClick={handleToggleOsMode}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[10px] font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition"
            title="Toggle Device Theme"
          >
            {isDark ? <Moon size={11} /> : <Sun size={11} />}
            <span>OS: {isDark ? 'Dark' : 'Light'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
