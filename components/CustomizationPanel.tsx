'use client';

import React, { useRef } from 'react';
import { StudioConfig } from '../lib/types';
import { SAMPLE_LOGOS } from '../lib/sampleLogos';
import { Upload } from 'lucide-react';

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

const ACCENT_PRESETS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Zinc 300', hex: '#D4D4D8' },
  { name: 'Cobalt', hex: '#3B82F6' },
  { name: 'Emerald', hex: '#10B981' },
  { name: 'Amber', hex: '#F59E0B' },
  { name: 'Rose', hex: '#F43F5E' },
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
    <div className="space-y-5">
      {/* 1. Logo Asset */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
            Logo Asset
          </span>
          <span className="text-[11px] font-mono text-zinc-400">
            {config.logoName}
          </span>
        </div>

        {/* Minimal Dropzone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer p-3 rounded-lg border border-dashed border-zinc-800 hover:border-zinc-600 bg-[#121214] hover:bg-zinc-900 transition flex items-center justify-center gap-2.5 text-zinc-400 hover:text-zinc-200"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".svg,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Upload size={14} className="text-zinc-500" />
          <span className="text-xs">Upload SVG or PNG</span>
        </div>

        {/* Sample Assets */}
        <div className="grid grid-cols-3 gap-1.5 pt-1">
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
                    ? 'bg-zinc-800 border-zinc-600 text-zinc-200'
                    : 'bg-[#121214] border-white/[0.04] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 flex-shrink-0"
                  dangerouslySetInnerHTML={{ __html: sample.svg }}
                />
                <span className="text-[11px] truncate">{sample.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Colors */}
      <div className="space-y-3 pt-3 border-t border-white/[0.06]">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
          Colors
        </span>

        {/* Accent Color */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Logo Tint</span>
          <div className="flex items-center gap-1.5">
            {ACCENT_PRESETS.map((c) => (
              <button
                key={c.hex}
                onClick={() => onChange({ accentColor: c.hex })}
                className={`w-4 h-4 rounded-full transition ${
                  config.accentColor.toLowerCase() === c.hex.toLowerCase()
                    ? 'ring-2 ring-offset-2 ring-offset-[#0A0A0C] ring-zinc-400 scale-110'
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

        {/* Background Color */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-400">Window Background</span>
          <div className="flex items-center gap-1.5">
            {BG_PRESETS.map((b) => (
              <button
                key={b.hex}
                onClick={() => onChange({ backgroundColor: b.hex })}
                className={`w-4 h-4 rounded-full border border-zinc-700 transition ${
                  config.backgroundColor.toLowerCase() === b.hex.toLowerCase()
                    ? 'ring-2 ring-offset-2 ring-offset-[#0A0A0C] ring-zinc-400 scale-110'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ backgroundColor: b.hex }}
                title={b.name}
              />
            ))}
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => onChange({ backgroundColor: e.target.value })}
              className="w-5 h-5 rounded cursor-pointer bg-transparent border-0 ml-1"
            />
          </div>
        </div>
      </div>

      {/* 3. Physics & Geometry */}
      <div className="space-y-3 pt-3 border-t border-white/[0.06]">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 block">
          Parameters
        </span>

        {/* Duration */}
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Duration</span>
            <span className="font-mono text-[11px] text-zinc-300">
              {config.durationMs}ms
            </span>
          </div>
          <input
            type="range"
            min="300"
            max="1500"
            step="50"
            value={config.durationMs}
            onChange={(e) => onChange({ durationMs: parseInt(e.target.value) })}
            className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-300"
          />
        </div>

        {/* Scale */}
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Scale</span>
            <span className="font-mono text-[11px] text-zinc-300">
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
            className="w-full h-1 bg-zinc-800 rounded appearance-none cursor-pointer accent-zinc-300"
          />
        </div>

        {/* App Title */}
        <div>
          <span className="text-xs text-zinc-400 block mb-1">App Name</span>
          <input
            type="text"
            value={config.appName}
            placeholder="App Title"
            onChange={(e) => onChange({ appName: e.target.value })}
            className="w-full bg-[#121214] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none focus:border-zinc-500 transition font-mono"
          />
        </div>
      </div>
    </div>
  );
}
