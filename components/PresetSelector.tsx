'use client';

import React, { useState, useMemo } from 'react';
import { ANIMATION_TEMPLATES } from '../lib/templates';
import { AnimationTemplateId } from '../lib/types';
import { Search, X } from 'lucide-react';

interface PresetSelectorProps {
  selectedId: AnimationTemplateId;
  onSelect: (id: AnimationTemplateId) => void;
  accentColor: string;
}

const CATEGORIES = ['All', 'Minimal', 'Modern', 'Cinematic', 'High Energy', 'Luxury'] as const;

export function PresetSelector({
  selectedId,
  onSelect,
}: PresetSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = useMemo(() => {
    return ANIMATION_TEMPLATES.filter((tpl) => {
      const matchesCategory =
        activeCategory === 'All' || tpl.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.tagline.toLowerCase().includes(q) ||
        tpl.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col h-full space-y-2.5">
      {/* Search Input */}
      <div className="relative">
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search presets..."
          className="w-full pl-8 pr-7 py-1.5 text-xs bg-[var(--surface-subtle)] border border-[var(--surface-border)] focus:border-zinc-400 dark:focus:border-zinc-500 rounded-md text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none transition"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap transition ${
              activeCategory === cat
                ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-subtle)]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Presets List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
        {filteredTemplates.length === 0 ? (
          <div className="py-8 text-center text-xs text-[var(--text-muted)]">
            No presets found.
          </div>
        ) : (
          filteredTemplates.map((tpl) => {
            const isSelected = tpl.id === selectedId;

            return (
              <button
                key={tpl.id}
                onClick={() => onSelect(tpl.id)}
                className={`w-full text-left p-2.5 rounded-lg border transition-all duration-100 ${
                  isSelected
                    ? 'bg-zinc-100 border-zinc-900 text-zinc-950 dark:bg-zinc-800 dark:border-zinc-200 dark:text-zinc-100 shadow-xs'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 text-zinc-700 dark:bg-zinc-900/50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:text-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-[var(--text-primary)] truncate">
                    {tpl.name}
                  </span>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] flex-shrink-0">
                    {tpl.defaultDurationMs}ms
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">
                  {tpl.tagline}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
