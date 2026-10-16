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

  const [pageTheme, setPageTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('native-splash-page-theme') as 'dark' | 'light' | null;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const [activeTab, setActiveTab] = useState<'presets' | 'customize'>('presets');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);
  const [replayNonce, setReplayNonce] = useState<number>(0);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isWhyNativeOpen, setIsWhyNativeOpen] = useState<boolean>(false);

  // Synchronize document attributes with page theme
  useEffect(() => {
    document.documentElement.classList.toggle('dark', pageTheme === 'dark');
    document.documentElement.classList.toggle('light', pageTheme === 'light');
    document.documentElement.setAttribute('data-theme', pageTheme);
  }, [pageTheme]);

  const togglePageTheme = () => {
    const next = pageTheme === 'dark' ? 'light' : 'dark';
    setPageTheme(next);
    localStorage.setItem('native-splash-page-theme', next);
  };

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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans selection:bg-zinc-700 selection:text-white transition-colors duration-200">
      {/* Top Navbar with Theme Switcher */}
      <Navbar
        pageTheme={pageTheme}
        onToggleTheme={togglePageTheme}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenInfoModal={() => setIsWhyNativeOpen(true)}
      />

      {/* Main Studio Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Tab Switcher */}
          <div className="flex items-center bg-[var(--surface-subtle)] p-1 rounded-lg border border-[var(--surface-border)] w-fit">
            <button
              onClick={() => setActiveTab('presets')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === 'presets'
                  ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Presets
            </button>

            <button
              onClick={() => setActiveTab('customize')}
              className={`px-3 py-1 rounded text-xs font-medium transition ${
                activeTab === 'customize'
                  ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              Asset & Styling
            </button>
          </div>

          {/* Panel Container */}
          <div className="bg-[var(--surface-card)] border border-[var(--surface-border)] rounded-xl p-4 sm:p-5 shadow-sm">
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
