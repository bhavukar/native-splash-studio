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
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          Animation Presets
        </span>
        <span className="text-[11px] font-mono text-[var(--text-muted)]">
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
                  ? 'bg-zinc-800/90 border-zinc-500 text-zinc-100 shadow-sm dark:bg-zinc-800 dark:border-zinc-500 dark:text-zinc-100'
                  : 'bg-[var(--surface-subtle)] border-[var(--surface-border)] hover:border-zinc-500/50 text-[var(--text-secondary)]'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-[var(--text-primary)]">
                  {tpl.name}
                </span>
                <span className="text-[10px] font-mono text-[var(--text-muted)]">
                  {tpl.defaultDurationMs}ms
                </span>
              </div>

              <p className="text-[11px] text-[var(--text-muted)] leading-snug line-clamp-2">
                {tpl.tagline}
              </p>

              <div className="mt-2 pt-2 border-t border-[var(--surface-border)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
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
