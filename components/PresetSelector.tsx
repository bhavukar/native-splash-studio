'use client';

import React from 'react';
import { ANIMATION_TEMPLATES } from '../lib/templates';
import { AnimationTemplateId } from '../lib/types';
import { Sparkles, Activity, ShieldAlert, Zap, Layers, Flame } from 'lucide-react';

interface PresetSelectorProps {
  selectedId: AnimationTemplateId;
  onSelect: (id: AnimationTemplateId) => void;
  accentColor: string;
}

const TEMPLATE_ICONS: Record<AnimationTemplateId, React.ReactNode> = {
  'spring-bloom': <Zap size={16} className="text-amber-400" />,
  'path-trace': <Layers size={16} className="text-cyan-400" />,
  'apple-iris': <Sparkles size={16} className="text-indigo-400" />,
  'sheen-3d': <Flame size={16} className="text-purple-400" />,
  'liquid-ripple': <Activity size={16} className="text-emerald-400" />,
  'neon-pulse': <ShieldAlert size={16} className="text-rose-400" />,
};

export function PresetSelector({
  selectedId,
  onSelect,
  accentColor,
}: PresetSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Native Animation Preset
        </label>
        <span className="text-[11px] font-mono text-slate-500">
          6 Math-Accurate Templates
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {ANIMATION_TEMPLATES.map((tpl) => {
          const isSelected = tpl.id === selectedId;

          return (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className={`group text-left p-3.5 rounded-2xl border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-blue-500/80 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/50 hover:border-slate-700'
              }`}
            >
              {/* Highlight Bar */}
              {isSelected && (
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ backgroundColor: accentColor || '#3B82F6' }}
                />
              )}

              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-slate-800/80 border border-slate-700/50">
                    {TEMPLATE_ICONS[tpl.id]}
                  </div>
                  <span className="text-xs font-semibold text-slate-100 group-hover:text-white">
                    {tpl.name}
                  </span>
                </div>

                <span
                  className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full ${
                    tpl.category === 'Luxury'
                      ? 'bg-purple-500/20 text-purple-300'
                      : tpl.category === 'High Energy'
                      ? 'bg-amber-500/20 text-amber-300'
                      : tpl.category === 'Minimal'
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-cyan-500/20 text-cyan-300'
                  }`}
                >
                  {tpl.category}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-snug line-clamp-2 mb-2">
                {tpl.tagline}
              </p>

              {/* Technical specs pill */}
              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Default: {tpl.defaultDurationMs}ms</span>
                <span className="truncate max-w-[120px] text-[9px] opacity-75">
                  {tpl.iosTimingCurve.split('(')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
