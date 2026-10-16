'use client';

import React, { useState, useRef } from 'react';
import { StudioConfig, BackdropEffect, TitleAnimation, ExitTransitionEffect } from '../lib/types';
import { SAMPLE_LOGOS } from '../lib/sampleLogos';
import { isColorLight, getAdaptiveThemeColors } from '../lib/colors';
import { Upload, Sun, Moon, Sliders, Palette, Sparkles, Layers } from 'lucide-react';

interface CustomizationPanelProps {
  config: StudioConfig;
  onChange: (updates: Partial<StudioConfig>) => void;
}

const BG_PRESETS = [
  { name: 'OLED Black', hex: '#000000' },
  { name: 'Studio Dark', hex: '#0B0B0E' },
  { name: 'Carbon', hex: '#121214' },
  { name: 'Slate', hex: '#0F172A' },
  { name: 'Pure White', hex: '#FFFFFF' },
];

const BACKDROP_OPTIONS: { id: BackdropEffect; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'Minimal raw canvas' },
  { id: 'aurora', label: 'Aurora Drift', desc: 'Atmospheric fluid mesh' },
  { id: 'particles', label: 'Particles', desc: 'Gravitational dust pull' },
  { id: 'shockwave', label: 'Shockwave', desc: 'Concentric pressure wave' },
  { id: 'lens-flare', label: 'Lens Flare', desc: 'Horizontal optical sheen' },
  { id: 'cyber-grid', label: 'Cyber Grid', desc: 'Perspective scanning plane' },
];

const TITLE_OPTIONS: { id: TitleAnimation; label: string; desc: string }[] = [
  { id: 'none', label: 'None', desc: 'Icon only without typography' },
  { id: 'letter-stagger', label: 'Stagger', desc: 'Letter-by-letter kinetic fly-in' },
  { id: 'tracking-expand', label: 'Tracking', desc: 'Cinematic tracking expand' },
  { id: 'mask-slide', label: 'Mask Slide', desc: 'Boundary clip upward unveil' },
];

const EXIT_OPTIONS: { id: ExitTransitionEffect; label: string; desc: string }[] = [
  { id: 'dissolve', label: 'Dissolve', desc: 'Seamless 60fps hardware fade' },
  { id: 'zoom-aperture', label: 'Zoom Aperture', desc: 'Twitter/Uber 40x flood wipe' },
  { id: 'curtain-up', label: 'Curtain Up', desc: 'Accelerated upward slide lift' },
];

export function CustomizationPanel({
  config,
  onChange,
}: CustomizationPanelProps) {
  const [activeSection, setActiveSection] = useState<'motion' | 'brand' | 'theme'>('motion');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isBgLight = isColorLight(config.backgroundColor);

  const activeAccentPresets = isBgLight
    ? [
        { name: 'Pitch Black', hex: '#09090B' },
        { name: 'Charcoal', hex: '#27272A' },
        { name: 'Cobalt', hex: '#2563EB' },
        { name: 'Emerald', hex: '#059669' },
        { name: 'Amber', hex: '#D97706' },
        { name: 'Rose', hex: '#E11D48' },
      ]
    : [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Zinc 300', hex: '#D4D4D8' },
        { name: 'Cobalt', hex: '#3B82F6' },
        { name: 'Emerald', hex: '#10B981' },
        { name: 'Amber', hex: '#F59E0B' },
        { name: 'Rose', hex: '#F43F5E' },
      ];

  const handleSelectBg = (hex: string) => {
    const isLight = isColorLight(hex);
    const nextMode = isLight ? 'light' : 'dark';
    let nextAccent = config.accentColor;
    if (isLight && isColorLight(config.accentColor)) {
      nextAccent = '#09090B';
    } else if (!isLight && !isColorLight(config.accentColor)) {
      nextAccent = '#EDEDED';
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
      {/* Inspector Section Switcher */}
      <div className="flex items-center bg-[var(--surface-subtle)] p-0.5 rounded-lg border border-[var(--surface-border)]">
        <button
          onClick={() => setActiveSection('motion')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition ${
            activeSection === 'motion'
              ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sparkles size={12} />
          <span>Motion FX</span>
        </button>

        <button
          onClick={() => setActiveSection('brand')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition ${
            activeSection === 'brand'
              ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Layers size={12} />
          <span>Brand</span>
        </button>

        <button
          onClick={() => setActiveSection('theme')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-md text-[11px] font-medium transition ${
            activeSection === 'theme'
              ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 shadow-sm'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Palette size={12} />
          <span>Colors</span>
        </button>
      </div>

      {/* Tab 1: Motion FX & Physics */}
      {activeSection === 'motion' && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Backdrop Effect */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
              Backdrop Atmosphere
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {BACKDROP_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ backdropEffect: opt.id })}
                  className={`p-2 rounded-lg border text-left transition ${
                    config.backdropEffect === opt.id
                      ? 'bg-zinc-800 border-zinc-500 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                      : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-500/50'
                  }`}
                >
                  <span className="text-xs font-medium block">{opt.label}</span>
                  <span className="text-[10px] text-[var(--text-muted)] block truncate">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title Typography Animation */}
          <div className="space-y-1.5 pt-3 border-t border-[var(--surface-border)]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
              Kinetic Typography
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {TITLE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ titleAnimation: opt.id })}
                  className={`p-2 rounded-lg border text-left transition ${
                    config.titleAnimation === opt.id
                      ? 'bg-zinc-800 border-zinc-500 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                      : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-500/50'
                  }`}
                >
                  <span className="text-xs font-medium block">{opt.label}</span>
                  <span className="text-[10px] text-[var(--text-muted)] block truncate">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Exit Transition */}
          <div className="space-y-1.5 pt-3 border-t border-[var(--surface-border)]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
              Exit Handoff Transition
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {EXIT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => onChange({ exitTransition: opt.id })}
                  className={`p-2 rounded-lg border text-left transition flex items-center justify-between ${
                    config.exitTransition === opt.id
                      ? 'bg-zinc-800 border-zinc-500 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                      : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-500/50'
                  }`}
                >
                  <div>
                    <span className="text-xs font-medium block">{opt.label}</span>
                    <span className="text-[10px] text-[var(--text-muted)] block">{opt.desc}</span>
                  </div>
                  {config.exitTransition === opt.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Duration Slider */}
          <div className="pt-3 border-t border-[var(--surface-border)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1.5">
              <span>Duration</span>
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
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
              className="w-full h-1 bg-zinc-700/50 rounded appearance-none cursor-pointer accent-zinc-500"
            />
          </div>
        </div>
      )}

      {/* Tab 2: Brand & Assets */}
      {activeSection === 'brand' && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Logo Asset Dropzone */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Custom Asset
              </span>
              <span className="text-[11px] font-mono text-[var(--text-secondary)] truncate max-w-[140px]">
                {config.logoName}
              </span>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer p-3 rounded-lg border border-dashed border-[var(--surface-border)] hover:border-zinc-500 bg-[var(--surface-subtle)] hover:bg-[var(--button-hover)] transition flex items-center justify-center gap-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".svg,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Upload size={14} className="text-[var(--text-muted)]" />
              <span className="text-xs">Upload SVG or PNG</span>
            </div>
          </div>

          {/* Built-in Vector Logos */}
          <div className="space-y-1.5 pt-2 border-t border-[var(--surface-border)]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
              <span>Vector Marks ({SAMPLE_LOGOS.length})</span>
              <span>Vector SVG</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 max-h-52 overflow-y-auto pr-1">
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
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-left transition ${
                      isSelected
                        ? 'bg-zinc-800 border-zinc-600 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                        : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-zinc-500/50'
                    }`}
                  >
                    <div
                      className="w-3.5 h-3.5 flex-shrink-0"
                      dangerouslySetInnerHTML={{ __html: sample.svg }}
                    />
                    <div className="truncate">
                      <span className="text-[11px] block truncate">{sample.name}</span>
                      <span className="text-[9px] font-mono text-[var(--text-muted)] block truncate">{sample.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Scale */}
          <div className="pt-2 border-t border-[var(--surface-border)]">
            <div className="flex items-center justify-between text-xs text-[var(--text-secondary)] mb-1.5">
              <span>Logo Scale</span>
              <span className="font-mono text-xs font-semibold text-[var(--text-primary)]">
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
              className="w-full h-1 bg-zinc-700/50 rounded appearance-none cursor-pointer accent-zinc-500"
            />
          </div>

          {/* App Name */}
          <div className="pt-2 border-t border-[var(--surface-border)]">
            <span className="text-xs text-[var(--text-secondary)] block mb-1">App Title</span>
            <input
              type="text"
              value={config.appName}
              onChange={(e) => onChange({ appName: e.target.value })}
              placeholder="e.g. Acme App"
              className="w-full px-3 py-1.5 text-xs bg-[var(--surface-subtle)] border border-[var(--surface-border)] rounded-md focus:border-zinc-500 text-[var(--text-primary)] focus:outline-none transition font-sans"
            />
          </div>
        </div>
      )}

      {/* Tab 3: Color & Theme */}
      {activeSection === 'theme' && (
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Device OS Theme Toggle */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)] block">
              Device System Appearance
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleToggleThemeMode('dark')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border font-medium text-xs transition ${
                  !isBgLight
                    ? 'bg-zinc-800 border-zinc-500 text-zinc-100 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                    : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Moon size={13} className={!isBgLight ? 'text-zinc-200' : 'text-zinc-500'} />
                <span>Dark Mode</span>
              </button>

              <button
                onClick={() => handleToggleThemeMode('light')}
                className={`flex items-center justify-center gap-2 p-2.5 rounded-lg border font-medium text-xs transition ${
                  isBgLight
                    ? 'bg-zinc-800 border-zinc-500 text-zinc-100 shadow-sm dark:bg-zinc-800 dark:text-zinc-100'
                    : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                <Sun size={13} className={isBgLight ? 'text-amber-400' : 'text-zinc-500'} />
                <span>Light Mode</span>
              </button>
            </div>
          </div>

          {/* Logo Tint Color */}
          <div className="space-y-2 pt-3 border-t border-[var(--surface-border)]">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-[var(--text-secondary)] block">Logo Tint</span>
                <span className="text-[9px] font-mono text-[var(--text-muted)]">
                  {isBgLight ? 'Optimized for Light Background' : 'Optimized for Dark Background'}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {activeAccentPresets.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => onChange({ accentColor: c.hex })}
                    className={`w-4 h-4 rounded-full transition ${
                      config.accentColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'ring-2 ring-offset-2 ring-offset-[var(--background)] ring-zinc-500 scale-110'
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

          {/* Window Background Color */}
          <div className="space-y-2 pt-3 border-t border-[var(--surface-border)]">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--text-secondary)]">Window Canvas Color</span>
              <div className="flex items-center gap-1.5">
                {BG_PRESETS.map((b) => (
                  <button
                    key={b.hex}
                    onClick={() => handleSelectBg(b.hex)}
                    className={`w-4 h-4 rounded-full border border-zinc-700 transition ${
                      config.backgroundColor.toLowerCase() === b.hex.toLowerCase()
                        ? 'ring-2 ring-offset-2 ring-offset-[var(--background)] ring-zinc-500 scale-110'
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
        </div>
      )}
    </div>
  );
}
