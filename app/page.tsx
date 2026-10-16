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
import { Sparkles, Sliders, Smartphone } from 'lucide-react';

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
    backdropEffect: 'none',
    titleAnimation: 'tracking-expand',
    exitTransition: 'dissolve',
  });

  const [pageTheme, setPageTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('native-splash-page-theme') as 'dark' | 'light' | null;
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });

  const [mobileTab, setMobileTab] = useState<'presets' | 'canvas' | 'inspector'>('canvas');
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
    <div className="h-screen w-screen bg-[var(--background)] text-[var(--foreground)] flex flex-col font-sans overflow-hidden selection:bg-zinc-700 selection:text-white transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        pageTheme={pageTheme}
        onToggleTheme={togglePageTheme}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenInfoModal={() => setIsWhyNativeOpen(true)}
      />

      {/* Mobile/Tablet View Selector (< lg) */}
      <div className="lg:hidden flex items-center justify-around border-b border-[var(--surface-border)] bg-[var(--surface-subtle)] px-2 py-1.5 flex-shrink-0">
        <button
          onClick={() => setMobileTab('presets')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
            mobileTab === 'presets'
              ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sparkles size={12} />
          <span>Presets</span>
        </button>
        <button
          onClick={() => setMobileTab('canvas')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
            mobileTab === 'canvas'
              ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Smartphone size={12} />
          <span>Canvas</span>
        </button>
        <button
          onClick={() => setMobileTab('inspector')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition ${
            mobileTab === 'inspector'
              ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sliders size={12} />
          <span>Inspector</span>
        </button>
      </div>

      {/* Main Studio 3-Column Workstation */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Motion Preset Library (Width: 320px) */}
        <aside
          className={`w-full lg:w-80 flex-shrink-0 border-r border-[var(--surface-border)] bg-[var(--surface-card)] h-full overflow-hidden p-3.5 flex flex-col z-20 ${
            mobileTab === 'presets' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <PresetSelector
            selectedId={config.templateId}
            onSelect={(id: AnimationTemplateId) => handleConfigChange({ templateId: id })}
            accentColor={config.accentColor}
          />
        </aside>

        {/* Center Stage: Studio Canvas Workstation (Flex-1) */}
        <main
          className={`flex-1 h-full relative overflow-hidden flex flex-col items-center justify-between p-3 sm:p-5 bg-zinc-950/40 dark:bg-[#070709] ${
            mobileTab === 'canvas' ? 'flex' : 'hidden lg:flex'
          }`}
          style={{
            backgroundImage:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
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

        {/* Right Panel: Precision Inspector (Width: 340px) */}
        <aside
          className={`w-full lg:w-[340px] flex-shrink-0 border-l border-[var(--surface-border)] bg-[var(--surface-card)] h-full overflow-hidden p-3.5 flex flex-col z-20 ${
            mobileTab === 'inspector' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          <CustomizationPanel
            config={config}
            onChange={handleConfigChange}
          />
        </aside>
      </div>

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
