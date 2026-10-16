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
    <div className="flex flex-col items-center">
      {/* Device Toolbar */}
      <div className="flex items-center gap-2 mb-5">
        {/* Device Switcher */}
        <div className="flex items-center bg-[var(--surface-subtle)] p-0.5 rounded-md border border-[var(--surface-border)]">
          <button
            onClick={() => onConfigChange({ device: 'iphone' })}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              isIphone
                ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            iPhone 16 Pro
          </button>
          <button
            onClick={() => onConfigChange({ device: 'pixel' })}
            className={`px-2.5 py-1 rounded text-xs font-medium transition ${
              !isIphone
                ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Pixel 9
          </button>
        </div>

        {/* Mock Device Theme Mode */}
        <button
          onClick={handleToggleOsMode}
          className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-2.5 py-1 rounded-md bg-[var(--surface-subtle)] border border-[var(--surface-border)] hover:bg-[var(--button-hover)] transition"
          title="Toggle preview OS mode (Light/Dark) - Adapts logo and background synchronously"
        >
          {isDark ? <Moon size={12} className="text-zinc-400" /> : <Sun size={12} className="text-amber-500" />}
          <span>OS: {isDark ? 'Dark' : 'Light'}</span>
        </button>

        {/* Handoff Preview */}
        <button
          onClick={() =>
            onConfigChange({
              showHomeScreenHandoff: !config.showHomeScreenHandoff,
            })
          }
          className={`text-xs px-2.5 py-1 rounded-md border transition ${
            config.showHomeScreenHandoff
              ? 'bg-zinc-800 border-zinc-600 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
              : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Handoff
        </button>
      </div>

      {/* Device Frame */}
      <div className="relative select-none">
        {isIphone ? (
          /* iPhone 16 Pro Matte Frame */
          <div className="relative w-[320px] h-[660px] bg-[#1C1C1E] rounded-[48px] p-[8px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#2C2C2E]">
            <div className="relative w-full h-full rounded-[40px] overflow-hidden bg-black flex flex-col">
              {/* iOS Status Bar */}
              <div className="absolute top-0 inset-x-0 h-10 z-40 flex items-center justify-between px-6 pt-1 pointer-events-none">
                <span
                  className={`text-[12px] font-semibold transition-colors duration-200 ${
                    isBgLight ? 'text-zinc-900' : 'text-zinc-300'
                  }`}
                >
                  9:41
                </span>

                {/* Dynamic Island */}
                <div className="absolute left-1/2 -translate-x-1/2 top-2 w-[84px] h-[22px] bg-black rounded-full flex items-center justify-between px-2">
                  <div className="w-2 h-2 rounded-full bg-[#111] border border-white/5" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#111]" />
                </div>

                <div
                  className={`flex items-center gap-1.5 transition-colors duration-200 ${
                    isBgLight ? 'text-zinc-900' : 'text-zinc-300'
                  }`}
                >
                  <span className="text-[10px] font-mono">5G</span>
                  <div
                    className={`w-4 h-2 rounded-[3px] border p-[1px] ${
                      isBgLight ? 'border-zinc-800' : 'border-zinc-500'
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-[1px] ${
                        isBgLight ? 'bg-zinc-900' : 'bg-zinc-300'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Viewport */}
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
                  className={`w-28 h-1 rounded-full transition-colors duration-200 ${
                    isBgLight ? 'bg-black/35' : 'bg-white/35'
                  }`}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Pixel 9 Frame */
          <div className="relative w-[320px] h-[660px] bg-[#161618] rounded-[40px] p-[8px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#27272A]">
            <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-black flex flex-col">
              {/* Android Status Bar */}
              <div className="absolute top-0 inset-x-0 h-9 z-40 flex items-center justify-between px-5 pt-1 pointer-events-none">
                <span
                  className={`text-[11px] font-mono transition-colors duration-200 ${
                    isBgLight ? 'text-zinc-900' : 'text-zinc-400'
                  }`}
                >
                  09:41
                </span>
                <div className="absolute left-1/2 -translate-x-1/2 top-2.5 w-3 h-3 rounded-full bg-[#0a0a0d] border border-white/10" />
                <span
                  className={`text-[10px] font-mono transition-colors duration-200 ${
                    isBgLight ? 'text-zinc-900' : 'text-zinc-400'
                  }`}
                >
                  100%
                </span>
              </div>

              {/* Viewport */}
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
                  className={`w-18 h-1 rounded-full transition-colors duration-200 ${
                    isBgLight ? 'bg-black/35' : 'bg-white/35'
                  }`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Scrub & Playback Bar */}
      <div className="w-full max-w-[320px] mt-4 bg-[var(--surface-subtle)] border border-[var(--surface-border)] rounded-lg p-2.5">
        {/* Timeline Scrub */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-mono text-[var(--text-muted)] w-12 text-left">
            {scrubProgress !== null
              ? `${Math.round(scrubProgress * config.durationMs)}ms`
              : 'Live'}
          </span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={scrubProgress ?? 1}
            onChange={(e) => onScrubChange(parseFloat(e.target.value))}
            className="flex-1 h-1 bg-zinc-700/50 rounded appearance-none cursor-pointer accent-zinc-500"
          />
          <button
            onClick={() => onScrubChange(null)}
            className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
              scrubProgress === null
                ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
          >
            Auto
          </button>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-1.5 border-t border-[var(--surface-border)]">
          <button
            onClick={onReplay}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-medium text-xs transition active:scale-[0.98]"
          >
            <RotateCcw size={11} />
            <span>Replay</span>
            <kbd className="text-[9px] font-mono text-zinc-400 ml-1">Space</kbd>
          </button>

          <div className="flex items-center bg-[var(--surface-card)] p-0.5 rounded border border-[var(--surface-border)]">
            {[0.5, 1.0, 1.5].map((speed) => (
              <button
                key={speed}
                onClick={() => onSpeedChange(speed)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition ${
                  playbackSpeed === speed
                    ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-700 dark:text-zinc-100 font-bold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
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
