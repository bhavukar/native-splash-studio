'use client';

import React, { useState } from 'react';
import { ANIMATION_TEMPLATES } from '../lib/templates';
import { AnimationTemplateId } from '../lib/types';

interface PresetSelectorProps {
  selectedId: AnimationTemplateId;
  onSelect: (id: AnimationTemplateId) => void;
  accentColor: string;
}

const CATEGORIES = ['All', 'Minimal', 'Modern', 'High Energy', 'Luxury'] as const;

export function PresetSelector({
  selectedId,
  onSelect,
}: PresetSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('All');

  const filteredTemplates = ANIMATION_TEMPLATES.filter((tpl) => {
    if (activeCategory === 'All') return true;
    return tpl.category === activeCategory;
  });

  return (
    <div className="space-y-3">
      {/* Header & Categories */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
        <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
          Animation Presets ({filteredTemplates.length})
        </span>

        {/* Category Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2 py-0.5 rounded text-[10px] font-mono transition flex-shrink-0 ${
                activeCategory === cat
                  ? 'bg-zinc-800 text-zinc-100 dark:bg-zinc-800 dark:text-zinc-100 font-medium'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-subtle)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[520px] overflow-y-auto pr-1">
        {filteredTemplates.map((tpl) => {
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
                <span className="truncate max-w-[130px]">
                  {tpl.androidInterpolator.replace('@android:interpolator/', '')}
                </span>
                <span className="truncate max-w-[90px]">
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
