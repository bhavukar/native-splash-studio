'use client';

import React from 'react';
import { ANIMATION_TEMPLATES } from '../lib/templates';
import { AnimationTemplateId } from '../lib/types';

interface PresetSelectorProps {
  selectedId: AnimationTemplateId;
  onSelect: (id: AnimationTemplateId) => void;
  accentColor: string;
}

export function PresetSelector({
  selectedId,
  onSelect,
}: PresetSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between pb-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-500">
          Animation Presets
        </span>
        <span className="text-[11px] font-mono text-zinc-600">
          Native Interpolators
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {ANIMATION_TEMPLATES.map((tpl) => {
          const isSelected = tpl.id === selectedId;

          return (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.id)}
              className={`group text-left p-3 rounded-lg border transition-all duration-150 ${
                isSelected
                  ? 'bg-zinc-800/80 border-zinc-500 text-zinc-100 shadow-sm'
                  : 'bg-[#121214] border-white/[0.06] hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-medium ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                  {tpl.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">
                  {tpl.defaultDurationMs}ms
                </span>
              </div>

              <p className="text-[11px] text-zinc-500 leading-snug line-clamp-2">
                {tpl.tagline}
              </p>

              <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-zinc-600">
                <span className="truncate max-w-[140px]">
                  {tpl.androidInterpolator.replace('@android:interpolator/', '')}
                </span>
                <span className="truncate max-w-[100px]">
                  {tpl.category}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
