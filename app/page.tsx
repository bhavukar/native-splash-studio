'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StudioConfig, AnimationTemplateId } from '../lib/types';
import { SAMPLE_LOGOS } from '../lib/sampleLogos';
import { ANIMATION_TEMPLATES } from '../lib/templates';
import { Navbar } from '../components/Navbar';
import { DeviceFrame } from '../components/DeviceFrame';
import { PresetSelector } from '../components/PresetSelector';
import { CustomizationPanel } from '../components/CustomizationPanel';
import { ExportModal } from '../components/ExportModal';
import { WhyNativeModal } from '../components/WhyNativeModal';
import { Sparkles, Sliders } from 'lucide-react';

export default function StudioPage() {
  const [config, setConfig] = useState<StudioConfig>({
    templateId: 'spring-bloom',
    device: 'iphone',
    themeMode: 'dark',
    durationMs: 850,
    backgroundColor: '#090A0F',
    accentColor: '#6366F1',
    logoScale: 1.0,
    logoSvg: SAMPLE_LOGOS[0].svg,
    logoName: SAMPLE_LOGOS[0].name,
    appName: 'Nova App',
    bundleId: 'com.nova.mobile',
    showHomeScreenHandoff: false,
  });

  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);
  const [replayNonce, setReplayNonce] = useState<number>(0);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isWhyNativeOpen, setIsWhyNativeOpen] = useState<boolean>(false);

  const handleReplay = useCallback(() => {
    setScrubProgress(null);
    setReplayNonce((n) => n + 1);
  }, []);

  const handleConfigChange = (updates: Partial<StudioConfig>) => {
    setConfig((prev) => {
      const next = { ...prev, ...updates };
      // If template changed, update default duration
      if (updates.templateId && updates.templateId !== prev.templateId) {
        const found = ANIMATION_TEMPLATES.find((t) => t.id === updates.templateId);
        if (found) {
          next.durationMs = found.defaultDurationMs;
        }
      }
      return next;
    });
    // Trigger replay to show changes immediately
    setReplayNonce((n) => n + 1);
  };

  // Keyboard shortcut: Spacebar to replay animation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        handleReplay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReplay]);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenExport={() => setIsExportOpen(true)}
        onOpenInfoModal={() => setIsWhyNativeOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Configuration & Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Hero Banner Pill */}
          <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900/30 via-indigo-900/20 to-purple-900/30 border border-blue-500/20 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">
                100% Native Architecture
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Design & Export Native Animated Splash Screens
            </h1>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              No slow Dart or JS runtime delays. Generates hardware-accelerated AnimatedVectorDrawables (AVD) for Android 12+ and Swift 120 FPS handoff for iOS, Flutter, and React Native.
            </p>
          </div>

          {/* Tab Switcher for Left Panel */}
          <div className="flex items-center bg-slate-900/80 p-1 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('presets')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'presets'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles size={14} />
              <span>1. Animation Presets</span>
            </button>

            <button
              onClick={() => setActiveTab('customize')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'customize'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders size={14} />
              <span>2. Asset & Styling</span>
            </button>
          </div>

          {/* Studio Panel Body */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-md">
            {activeTab === 'presets' ? (
              <PresetSelector
                selectedId={config.templateId}
                onSelect={(id: AnimationTemplateId) =>
                  handleConfigChange({ templateId: id })
                }
                accentColor={config.accentColor}
              />
            ) : (
              <CustomizationPanel
                config={config}
                onChange={handleConfigChange}
              />
            )}
          </div>

          {/* Quick Platform Badges */}
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-slate-200 font-semibold">Zero-Lag Targets:</span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[11px] text-slate-300">
                Android 12+ (AVD)
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[11px] text-slate-300">
                iOS LaunchScreen
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[11px] text-slate-300">
                Flutter
              </span>
              <span className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[11px] text-slate-300">
                React Native
              </span>
            </div>

            <button
              onClick={() => setIsExportOpen(true)}
              className="text-blue-400 hover:text-blue-300 font-semibold text-xs flex items-center gap-1"
            >
              <span>Export Code</span>
              <span>→</span>
            </button>
          </div>
        </div>

        {/* Right Column: Physical Device Simulator & Preview (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
          <DeviceFrame
            config={config}
            onConfigChange={handleConfigChange}
            replayNonce={replayNonce}
            onReplay={handleReplay}
            playbackSpeed={playbackSpeed}
            onSpeedChange={(speed) => setPlaybackSpeed(speed)}
            scrubProgress={scrubProgress}
            onScrubChange={(p) => setScrubProgress(p)}
          />
        </div>
      </main>

      {/* Export & Code Inspection Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />

      {/* Why Native Educational Modal */}
      <WhyNativeModal
        isOpen={isWhyNativeOpen}
        onClose={() => setIsWhyNativeOpen(false)}
      />
    </div>
  );
}
