export interface SampleLogo {
  id: string;
  name: string;
  category: string;
  svg: string;
  pathData: string;
}

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'nova-spark',
    name: 'Nova Spark',
    category: 'AI / Tech',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 5L62 38L95 50L62 62L50 95L38 62L5 50L38 38L50 5Z" fill="currentColor"/>
  <circle cx="50" cy="50" r="10" fill="#FFFFFF" fill-opacity="0.3"/>
</svg>`,
    pathData: 'M50 5L62 38L95 50L62 62L50 95L38 62L5 50L38 38L50 5Z',
  },
  {
    id: 'quantum-helix',
    name: 'Quantum Helix',
    category: 'Fintech / Web3',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M25 50C25 36.1929 36.1929 25 50 25C63.8071 25 75 36.1929 75 50" stroke="currentColor" stroke-width="10" stroke-linecap="round"/>
  <path d="M75 50C75 63.8071 63.8071 75 50 75C36.1929 75 25 63.8071 25 50" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-dasharray="14 10"/>
  <circle cx="50" cy="50" r="12" fill="currentColor"/>
</svg>`,
    pathData: 'M25 50C25 36.1929 36.1929 25 50 25C63.8071 25 75 36.1929 75 50',
  },
  {
    id: 'hyper-bolt',
    name: 'Hyper Bolt',
    category: 'Productivity',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M56 8L18 56H48L40 92L82 44H52L56 8Z" fill="currentColor" stroke="currentColor" stroke-width="4" stroke-linejoin="round"/>
</svg>`,
    pathData: 'M56 8L18 56H48L40 92L82 44H52L56 8Z',
  },
  {
    id: 'apex-shield',
    name: 'Apex Shield',
    category: 'Security / Enterprise',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 10L82 24V50C82 70 68 87 50 92C32 87 18 70 18 50V24L50 10Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/>
  <path d="M38 50L46 58L62 42" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    pathData: 'M50 10L82 24V50C82 70 68 87 50 92C32 87 18 70 18 50V24L50 10Z',
  },
  {
    id: 'zenith-prism',
    name: 'Zenith Prism',
    category: 'Creative / Media',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 12L88 78H12L50 12Z" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/>
  <path d="M50 36L72 74H28L50 36Z" fill="currentColor"/>
</svg>`,
    pathData: 'M50 12L88 78H12L50 12Z',
  },
  {
    id: 'aura-rings',
    name: 'Aura Rings',
    category: 'Health / Lifestyle',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="42" cy="50" r="28" stroke="currentColor" stroke-width="8" stroke-opacity="0.6"/>
  <circle cx="58" cy="50" r="28" stroke="currentColor" stroke-width="8"/>
</svg>`,
    pathData: 'M 42 50 m -28, 0 a 28,28 0 1,0 56,0 a 28,28 0 1,0 -56,0',
  },
];

export function extractPathDataFromSvg(svgContent: string): string {
  const pathMatch = svgContent.match(/<path[^>]*d="([^"]+)"/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }
  return 'M50 10L85 85H15Z';
}
