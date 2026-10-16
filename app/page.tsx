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

export default function StudioPage() {
  const [config, setConfig] = useState<StudioConfig>({
    templateId: 'spring-bloom',
    device: 'iphone',
    themeMode: 'dark',
    durationMs: 850,
    backgroundColor: '#09090B',
    accentColor: '#EDEDED',
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
      if (updates.templateId && updates.templateId !== prev.templateId) {
        const found = ANIMATION_TEMPLATES.find((t) => t.id === updates.templateId);
        if (found) {
          next.durationMs = found.defaultDurationMs;
        }
      }
      return next;
    });
    setReplayNonce((n) => n + 1);
  };

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
    <div className="min-h-screen bg-[#09090B] text-zinc-300 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        onOpenExport={() => setIsExportOpen(true)}
        onOpenInfoModal={() => setIsWhyNativeOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Switcher */}
          <div className="flex items-center bg-[#121214] p-1 rounded-lg border border-white/[0.06] w-fit">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === 'presets'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Presets
            </button>

            <button
              onClick={() => setActiveTab('customize')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === 'customize'
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Asset & Styling
            </button>
          </div>

          {/* Panel Container */}
          <div className="bg-[#0E0E11] border border-white/[0.06] rounded-xl p-4 sm:p-5">
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
        </div>

        {/* Right Column: Device Canvas (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center sticky top-20">
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

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />

      <WhyNativeModal
        isOpen={isWhyNativeOpen}
        onClose={() => setIsWhyNativeOpen(false)}
      />
    </div>
  );
}
