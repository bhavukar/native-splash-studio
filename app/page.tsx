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

export default function StudioPage() {
  const [config, setConfig] = useState<StudioConfig>({
    templateId: 'spring-bloom',
    device: 'iphone',
    themeMode: 'light',
    durationMs: 850,
    backgroundColor: '#FFFFFF',
    accentColor: '#09090B',
    logoScale: 1.0,
    logoSvg: SAMPLE_LOGOS[0].svg,
    logoName: SAMPLE_LOGOS[0].name,
    appName: 'App',
    bundleId: 'com.example.app',
    showHomeScreenHandoff: false,
    backdropEffect: 'none',
    titleAnimation: 'none',
    exitTransition: 'dissolve',
  });

  const [pageTheme, setPageTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('native-splash-page-theme') as 'dark' | 'light' | null;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'light';
  });

  const [mobileTab, setMobileTab] = useState<'presets' | 'canvas' | 'inspector'>('canvas');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);
  const [replayNonce, setReplayNonce] = useState<number>(0);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

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
          if (found.defaultBackdrop) next.backdropEffect = found.defaultBackdrop;
          if (found.defaultTitleAnim) next.titleAnimation = found.defaultTitleAnim;
          if (found.defaultExit) next.exitTransition = found.defaultExit;
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
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setIsExportOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReplay]);

  return (
    <div className="h-screen w-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans overflow-hidden transition-colors duration-150">
      {/* Top Navbar */}
      <Navbar
        pageTheme={pageTheme}
        onToggleTheme={togglePageTheme}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {/* Mobile/Tablet View Selector (< lg) */}
      <div className="lg:hidden flex items-center justify-around border-b border-[var(--surface-border)] bg-[var(--surface-subtle)] px-2 py-1 flex-shrink-0">
        <button
          onClick={() => setMobileTab('presets')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
            mobileTab === 'presets'
              ? 'bg-white text-zinc-950 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          Presets
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
            mobileTab === 'canvas'
              ? 'bg-white text-zinc-950 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          Preview
        </button>
        <button
          onClick={() => setMobileTab('inspector')}
          className={`px-3 py-1 rounded-md text-xs font-medium transition ${
            mobileTab === 'inspector'
              ? 'bg-white text-zinc-950 dark:bg-zinc-800 dark:text-zinc-100 shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          Settings
        </button>
      </div>

      {/* Main Studio 3-Column Workstation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Presets (Width: 300px) */}
        <aside
          className={`w-full lg:w-76 flex-shrink-0 border-r border-[var(--surface-border)] bg-[var(--surface-card)] h-full overflow-hidden p-3 flex flex-col z-20 ${
            mobileTab === 'presets' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <PresetSelector
            selectedId={config.templateId}
            onSelect={(id: AnimationTemplateId) => handleConfigChange({ templateId: id })}
            accentColor={config.accentColor}
          />
        </aside>

        {/* Center Stage: Phone Preview (Flex-1) */}
        <main
          className={`flex-1 h-full relative overflow-hidden flex flex-col items-center justify-between p-3 sm:p-5 bg-zinc-50/70 dark:bg-[#070709] ${
            mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'
          }`}
          style={{
            backgroundImage:
              pageTheme === 'light'
                ? 'radial-gradient(circle at center, rgba(0, 0, 0, 0.05) 1px, transparent 1px)'
                : 'radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        >
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
        </main>

        {/* Right Panel: Settings (Width: 320px) */}
        <aside
          className={`w-full lg:w-80 flex-shrink-0 border-l border-[var(--surface-border)] bg-[var(--surface-card)] h-full overflow-hidden p-3 flex flex-col z-20 ${
            mobileTab === 'inspector' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <CustomizationPanel
            config={config}
            onChange={handleConfigChange}
          />
        </aside>
      </div>

      {/* Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={config}
      />
    </div>
  );
}
