'use client';

import React, { useRef } from 'react';
import { StudioConfig } from '../lib/types';
import { SAMPLE_LOGOS } from '../lib/sampleLogos';
import { Upload, Sliders, Palette, Clock, Sparkles } from 'lucide-react';

interface CustomizationPanelProps {
  config: StudioConfig;
  onChange: (updates: Partial<StudioConfig>) => void;
}

const BG_PRESETS = [
  { name: 'OLED Black', hex: '#000000' },
  { name: 'Deep Space', hex: '#090A0F' },
  { name: 'Cyber Blue', hex: '#050B1A' },
  { name: 'Slate Dark', hex: '#0F172A' },
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Off White', hex: '#F8FAFC' },
];

const ACCENT_PRESETS = [
  { name: 'Electric Indigo', hex: '#6366F1' },
  { name: 'Apple Blue', hex: '#007AFF' },
  { name: 'Cyan Neon', hex: '#06B6D4' },
  { name: 'Emerald Mint', hex: '#10B981' },
  { name: 'Sunset Amber', hex: '#F59E0B' },
  { name: 'Crimson Rose', hex: '#F43F5E' },
  { name: 'Clean White', hex: '#FFFFFF' },
];

export function CustomizationPanel({
  config,
  onChange,
}: CustomizationPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      // For PNG / JPEG, convert to an inline SVG with embedded base64 image
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
    <div className="space-y-6">
      {/* ================= 1. Logo Asset Selection ================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-blue-400" />
            <span>Logo Asset (SVG or PNG)</span>
          </label>
          <span className="text-[11px] text-slate-500 font-mono">
            {config.logoName}
          </span>
        </div>

        {/* Upload Button & Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="group cursor-pointer p-4 rounded-2xl border border-dashed border-slate-700 hover:border-blue-500 bg-slate-900/60 hover:bg-slate-800/50 transition-all flex flex-col items-center justify-center text-center gap-2"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
            <Upload size={16} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-200">
              Click or drag your brand logo here
            </p>
            <p className="text-[10px] text-slate-500">
              Vector SVG recommended for sharpest native output • PNG supported
            </p>
          </div>
        </div>

        {/* Sample Curated Startup Logos */}
        <div className="pt-2">
          <span className="text-[10px] font-mono uppercase text-slate-500 block mb-2">
            Or choose a sample asset:
          </span>
          <div className="grid grid-cols-3 gap-2">
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
                  className={`flex items-center gap-2 p-2 rounded-xl border text-left transition ${
                    isSelected
                      ? 'bg-blue-600/20 border-blue-500/70 text-blue-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div
                    className="w-5 h-5 flex-shrink-0"
                    dangerouslySetInnerHTML={{ __html: sample.svg }}
                  />
                  <span className="text-[11px] font-medium truncate">
                    {sample.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 2. Colors & Styling ================= */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Palette size={14} className="text-indigo-400" />
          <span>Brand & Environment Colors</span>
        </label>

        {/* Accent Color */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Logo Accent / Glow Color</span>
            <span className="font-mono text-[11px] text-slate-400">
              {config.accentColor}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {ACCENT_PRESETS.map((c) => (
              <button
                key={c.hex}
                onClick={() => onChange({ accentColor: c.hex })}
                className={`w-6 h-6 rounded-full border transition transform active:scale-90 ${
                  config.accentColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-white scale-110'
                    : 'border-slate-700 hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <input
              type="color"
              value={config.accentColor}
              onChange={(e) => onChange({ accentColor: e.target.value })}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
              title="Custom Hex Color"
            />
          </div>
        </div>

        {/* Background Color */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
            <span>Native Splash Window Background</span>
            <span className="font-mono text-[11px] text-slate-400">
              {config.backgroundColor}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {BG_PRESETS.map((b) => (
              <button
                key={b.hex}
                onClick={() => onChange({ backgroundColor: b.hex })}
                className={`w-6 h-6 rounded-full border transition transform active:scale-90 ${
                  config.backgroundColor.toLowerCase() === b.hex.toLowerCase()
                    ? 'ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-500 scale-110'
                    : 'border-slate-700 hover:scale-105'
                }`}
                style={{ backgroundColor: b.hex }}
                title={b.name}
              />
            ))}
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
              title="Custom Hex Background"
            />
          </div>
        </div>
      </div>

      {/* ================= 3. Scale & Timing Controls ================= */}
      <div className="space-y-4 pt-2 border-t border-slate-800/80">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sliders size={14} className="text-cyan-400" />
          <span>Physics & Proportions</span>
        </label>

        {/* Animation Duration */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span className="flex items-center gap-1">
              <Clock size={12} className="text-slate-400" />
              Duration (Android max 1000ms recommended)
            </span>
            <span className="font-mono text-[11px] text-blue-400 font-semibold">
              {config.durationMs}ms
            </span>
          </div>
          <input
            type="range"
            min="400"
            max="1600"
            step="50"
            value={config.durationMs}
            onChange={(e) => onChange({ durationMs: parseInt(e.target.value) })}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* Logo Scale */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span>Logo Scale Size</span>
            <span className="font-mono text-[11px] text-blue-400 font-semibold">
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
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>

        {/* App Title Subtitle */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-300 mb-1.5">
            <span>App Name (Optional Brand Subtitle)</span>
          </div>
          <input
            type="text"
            value={config.appName}
            placeholder="e.g. Acme Studio"
            onChange={(e) => onChange({ appName: e.target.value })}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition"
          />
        </div>
      </div>
    </div>
  );
}
