'use client';

import React, { useState, useRef } from 'react';
import { StudioConfig, BackdropEffect, TitleAnimation, ExitTransitionEffect } from '../lib/types';
import { SAMPLE_LOGOS } from '../lib/sampleLogos';
import { isColorLight, getAdaptiveThemeColors } from '../lib/colors';
import { removeBackground } from '../lib/bgRemover';
import { Upload, Sun, Moon, Wand2 } from 'lucide-react';

interface CustomizationPanelProps {
  config: StudioConfig;
  onChange: (updates: Partial<StudioConfig>) => void;
}

const BG_PRESETS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Light Gray', hex: '#F4F4F5' },
  { name: 'Dark', hex: '#18181B' },
  { name: 'OLED Black', hex: '#000000' },
  { name: 'Slate', hex: '#0F172A' },
];

const BACKDROP_OPTIONS: { id: BackdropEffect; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'aurora', label: 'Aurora' },
  { id: 'particles', label: 'Particles' },
  { id: 'shockwave', label: 'Shockwave' },
  { id: 'lens-flare', label: 'Lens Flare' },
  { id: 'cyber-grid', label: 'Grid' },
];

const TITLE_OPTIONS: { id: TitleAnimation; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'letter-stagger', label: 'Stagger' },
  { id: 'tracking-expand', label: 'Tracking' },
  { id: 'mask-slide', label: 'Mask Slide' },
];

const EXIT_OPTIONS: { id: ExitTransitionEffect; label: string }[] = [
  { id: 'dissolve', label: 'Dissolve' },
  { id: 'zoom-aperture', label: 'Zoom' },
  { id: 'curtain-up', label: 'Curtain Up' },
];

export function CustomizationPanel({
  config,
  onChange,
}: CustomizationPanelProps) {
  const [activeSection, setActiveSection] = useState<'motion' | 'brand' | 'theme'>('motion');
  const [isRemovingBg, setIsRemovingBg] = useState(false);
  const [removeBgStatus, setRemoveBgStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBgLight = isColorLight(config.backgroundColor);

  const handleRemoveBackground = async (color: string) => {
    setIsRemovingBg(true);
    setRemoveBgStatus(null);
    try {
      const res = await removeBackground(config.logoSvg, { targetColor: color });
      if (res.success && res.resultSvg) {
        onChange({ logoSvg: res.resultSvg });
        setRemoveBgStatus(res.message || 'Background removed');
        setTimeout(() => setRemoveBgStatus(null), 3000);
      }
    } catch (e: any) {
      console.error('BG removal failed:', e);
    } finally {
      setIsRemovingBg(false);
    }
  };

  const activeAccentPresets = isBgLight
    ? [
        { name: 'Black', hex: '#09090B' },
        { name: 'Zinc', hex: '#52525B' },
        { name: 'Blue', hex: '#2563EB' },
        { name: 'Emerald', hex: '#059669' },
        { name: 'Amber', hex: '#D97706' },
      ]
    : [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Zinc', hex: '#D4D4D8' },
        { name: 'Blue', hex: '#3B82F6' },
        { name: 'Emerald', hex: '#10B981' },
        { name: 'Amber', hex: '#F59E0B' },
      ];

  const handleSelectBg = (hex: string) => {
    const isLight = isColorLight(hex);
    const nextMode = isLight ? 'light' : 'dark';
    let nextAccent = config.accentColor;
    if (isLight && isColorLight(config.accentColor)) {
      nextAccent = '#09090B';
    } else if (!isLight && !isColorLight(config.accentColor)) {
      nextAccent = '#FFFFFF';
    }
    onChange({
      backgroundColor: hex,
      themeMode: nextMode,
      accentColor: nextAccent,
    });
  };

  const handleToggleThemeMode = (mode: 'light' | 'dark') => {
    const next = getAdaptiveThemeColors(mode, config.accentColor);
    onChange({
      themeMode: mode,
      backgroundColor: next.backgroundColor,
      accentColor: next.accentColor,
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.type === 'image/svg+xml') {
      reader.onload = (event) => {
        const svgString = event.target?.result as string;
        onChange({
          logoSvg: svgString,
          logoName: file.name.replace(/\.[^/.]+$/, ''),
        });
      };
      reader.readAsText(file);
    } else {
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        const wrappedSvg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <image href="${base64}" x="5" y="5" width="90" height="90" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
        onChange({
          logoSvg: wrappedSvg,
          logoName: file.name.replace(/\.[^/.]+$/, ''),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-3">
      {/* Tab Switcher */}
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-lg">
        <button
          onClick={() => setActiveSection('motion')}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition ${
            activeSection === 'motion'
              ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          Motion
        </button>

        <button
          onClick={() => setActiveSection('brand')}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition ${
            activeSection === 'brand'
              ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          Logo
        </button>

        <button
          onClick={() => setActiveSection('theme')}
          className={`flex-1 py-1 rounded-md text-xs font-medium transition ${
            activeSection === 'theme'
              ? 'bg-white text-zinc-950 shadow-xs dark:bg-zinc-700 dark:text-zinc-100'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          Theme
        </button>
      </div>

      {/* Tab 1: Motion */}
      {activeSection === 'motion' && (
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
          {/* Duration */}
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1.5">
              <span>Duration</span>
              <span className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {config.durationMs}ms
              </span>
            </div>
            <input
              type="range"
              min="300"
              max="1600"
              step="50"
              value={config.durationMs}
              onChange={(e) => onChange({ durationMs: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-sm appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
            />
          </div>

          {/* Backdrop Effect */}
          <div className="space-y-1.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 block">
              Backdrop
            </span>
            <div className="grid grid-cols-3 gap-1">
              {BACKDROP_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ backdropEffect: opt.id })}
                  className={`py-1.5 px-2 rounded-md border text-center text-xs font-medium transition ${
                    config.backdropEffect === opt.id
                      ? 'bg-zinc-100 border-zinc-900 text-zinc-950 dark:bg-zinc-800 dark:border-zinc-200 dark:text-zinc-100 shadow-xs'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title Typography */}
          <div className="space-y-1.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 block">
              Title
            </span>
            <div className="grid grid-cols-2 gap-1">
              {TITLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ titleAnimation: opt.id })}
                  className={`py-1.5 px-2 rounded-md border text-center text-xs font-medium transition ${
                    config.titleAnimation === opt.id
                      ? 'bg-zinc-100 border-zinc-900 text-zinc-950 dark:bg-zinc-800 dark:border-zinc-200 dark:text-zinc-100 shadow-xs'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exit Transition */}
          <div className="space-y-1.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 block">
              Transition
            </span>
            <div className="grid grid-cols-3 gap-1">
              {EXIT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ exitTransition: opt.id })}
                  className={`py-1.5 px-2 rounded-md border text-center text-xs font-medium transition ${
                    config.exitTransition === opt.id
                      ? 'bg-zinc-100 border-zinc-900 text-zinc-950 dark:bg-zinc-800 dark:border-zinc-200 dark:text-zinc-100 shadow-xs'
                      : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Logo */}
      {activeSection === 'brand' && (
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
          {/* Custom Upload */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-zinc-500">
              <span>Custom Logo</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300 truncate max-w-[120px]">
                {config.logoName}
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer p-2.5 rounded-lg border border-dashed border-zinc-300 hover:border-zinc-400 dark:border-zinc-700 bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:hover:bg-zinc-800 transition flex items-center justify-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload size={13} />
              <span className="text-xs font-medium">Upload SVG or PNG</span>
            </div>

            {/* Remove Background via Local FFmpeg */}
            <div className="p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Wand2 size={12} className="text-zinc-600 dark:text-zinc-400" />
                  <span className="text-xs font-medium text-zinc-800 dark:text-zinc-200">Remove Background</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">FFmpeg</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={isRemovingBg}
                  onClick={() => handleRemoveBackground('#FFFFFF')}
                  className="flex-1 py-1 px-2 rounded-md text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 transition font-medium text-center disabled:opacity-50"
                >
                  {isRemovingBg ? 'Working...' : 'Key White BG'}
                </button>
                <button
                  type="button"
                  disabled={isRemovingBg}
                  onClick={() => handleRemoveBackground('#000000')}
                  className="flex-1 py-1 px-2 rounded-md text-xs bg-zinc-100 hover:bg-zinc-200 text-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-200 transition font-medium text-center disabled:opacity-50"
                >
                  {isRemovingBg ? 'Working...' : 'Key Black BG'}
                </button>
              </div>
              {removeBgStatus && (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ {removeBgStatus}
                </p>
              )}
            </div>
          </div>

          {/* Built-in Logos */}
          <div className="space-y-1.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-[11px] font-medium text-zinc-500 block">
              Sample Logos
            </span>
            <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pr-0.5">
              {SAMPLE_LOGOS.map((sample) => {
                const isSelected = config.logoName === sample.name;
                return (
                  <button
                    key={sample.id}
                    onClick={() =>
                      onChange({
                        logoSvg: sample.svg,
                        logoName: sample.name,
                      })
                    }
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md border text-left transition ${
                      isSelected
                        ? 'bg-zinc-100 border-zinc-900 text-zinc-950 dark:bg-zinc-800 dark:border-zinc-200 dark:text-zinc-100'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 flex-shrink-0"
                      dangerouslySetInnerHTML={{ __html: sample.svg }}
                    />
                    <span className="text-xs truncate">{sample.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Scale */}
          <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400 mb-1.5">
              <span>Scale</span>
              <span className="font-mono text-xs font-medium text-zinc-900 dark:text-zinc-100">
                {Math.round(config.logoScale * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.6"
              max="1.4"
              step="0.05"
              value={config.logoScale}
              onChange={(e) => onChange({ logoScale: parseFloat(e.target.value) })}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-sm appearance-none cursor-pointer accent-zinc-900 dark:accent-zinc-100"
            />
          </div>

          {/* App Title */}
          <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <span className="text-xs text-zinc-600 dark:text-zinc-400 block mb-1">App Name</span>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => onChange({ appName: e.target.value })}
              placeholder="e.g. Acme App"
              className="w-full px-2.5 py-1.5 text-xs bg-zinc-50 border border-zinc-200 rounded-md focus:border-zinc-400 text-zinc-900 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-100 focus:outline-none transition"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Theme */}
      {activeSection === 'theme' && (
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
          {/* Device OS Theme Toggle */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-zinc-500 block">
              Device OS Theme
            </span>
            <div className="grid grid-cols-2 gap-1">
              <button
                onClick={() => handleToggleThemeMode('light')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md border text-xs font-medium transition ${
                  isBgLight
                    ? 'bg-zinc-100 border-zinc-900 text-zinc-950 dark:bg-zinc-800 dark:border-zinc-200 dark:text-zinc-100 shadow-xs'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                }`}
              >
                <Sun size={13} />
                <span>Light</span>
              </button>

              <button
                onClick={() => handleToggleThemeMode('dark')}
                className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md border text-xs font-medium transition ${
                  !isBgLight
                    ? 'bg-zinc-100 border-zinc-900 text-zinc-950 dark:bg-zinc-800 dark:border-zinc-200 dark:text-zinc-100 shadow-xs'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400'
                }`}
              >
                <Moon size={13} />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Window Background Color */}
          <div className="space-y-1.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Background</span>
              <div className="flex items-center gap-1.5">
                {BG_PRESETS.map((b) => (
                  <button
                    key={b.hex}
                    onClick={() => handleSelectBg(b.hex)}
                    className={`w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600 transition ${
                      config.backgroundColor.toLowerCase() === b.hex.toLowerCase()
                        ? 'ring-2 ring-zinc-900 dark:ring-zinc-100 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: b.hex }}
                    title={b.name}
                  />
                ))}
                <input
                  type="color"
                  value={config.backgroundColor}
                  onChange={(e) => {
                    const newBg = e.target.value;
                    const isLight = isColorLight(newBg);
                    onChange({
                      backgroundColor: newBg,
                      themeMode: isLight ? 'light' : 'dark',
                    });
                  }}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 ml-1"
                />
              </div>
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-1.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-600 dark:text-zinc-400">Logo Tint</span>
              <div className="flex items-center gap-1.5">
                {activeAccentPresets.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => onChange({ accentColor: c.hex })}
                    className={`w-4 h-4 rounded-full transition ${
                      config.accentColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'ring-2 ring-zinc-900 dark:ring-zinc-100 scale-110'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                <input
                  type="color"
                  value={config.accentColor}
                  onChange={(e) => onChange({ accentColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 ml-1"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
