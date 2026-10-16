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
  {
    id: 'vortex-ribbon',
    name: 'Vortex Ribbon',
    category: 'Cloud / Data',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 16C31.22 16 16 31.22 16 50C16 68.78 31.22 84 50 84C62.45 84 73.34 77.29 79.2 67.24L65.88 59.55C62.7 65.01 56.78 68.67 50 68.67C39.69 68.67 31.33 60.31 31.33 50C31.33 39.69 39.69 31.33 50 31.33C57.44 31.33 63.85 35.68 66.86 42H50V58H84V50C84 31.22 68.78 16 50 16Z" fill="currentColor"/>
</svg>`,
    pathData: 'M50 16C31.22 16 16 31.22 16 50C16 68.78 31.22 84 50 84C62.45 84 73.34 77.29 79.2 67.24L65.88 59.55C62.7 65.01 56.78 68.67 50 68.67C39.69 68.67 31.33 60.31 31.33 50C31.33 39.69 39.69 31.33 50 31.33C57.44 31.33 63.85 35.68 66.86 42H50V58H84V50C84 31.22 68.78 16 50 16Z',
  },
  {
    id: 'monolith-cube',
    name: 'Monolith 3D',
    category: 'DevTools / Infra',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 12L85 32V72L50 92L15 72V32L50 12Z" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
  <path d="M50 12V52M50 52L85 32M50 52L15 32M50 52V92" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="50" cy="52" r="7" fill="currentColor"/>
</svg>`,
    pathData: 'M50 12L85 32V72L50 92L15 72V32L50 12Z',
  },
  {
    id: 'pulse-beat',
    name: 'Pulse Beat',
    category: 'Health / Fitness',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 52H32L40 28L54 74L64 42L72 52H88" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="50" cy="18" r="6" fill="currentColor"/>
</svg>`,
    pathData: 'M12 52H32L40 28L54 74L64 42L72 52H88',
  },
  {
    id: 'orion-star',
    name: 'Orion Compass',
    category: 'Travel / Maps',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M50 10L58 42L90 50L58 58L50 90L42 58L10 50L42 42L50 10Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
  <circle cx="50" cy="50" r="8" fill="currentColor"/>
  <path d="M26 26L36 36M74 26L64 36M26 74L36 64M74 74L64 64" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>
</svg>`,
    pathData: 'M50 10L58 42L90 50L58 58L50 90L42 58L10 50L42 42L50 10Z',
  },
  {
    id: 'falcon-wing',
    name: 'Falcon Wing',
    category: 'Aerospace / Speed',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M88 24C62 24 40 40 34 66C44 54 58 48 74 48H88V24Z" fill="currentColor"/>
  <path d="M72 54C52 54 36 66 30 84C38 74 50 68 64 68H72V54Z" fill="currentColor" fill-opacity="0.6"/>
  <path d="M22 46C20 60 14 74 12 82C22 76 28 64 30 52L22 46Z" fill="currentColor" fill-opacity="0.3"/>
</svg>`,
    pathData: 'M88 24C62 24 40 40 34 66C44 54 58 48 74 48H88V24Z',
  },
  {
    id: 'eclipse-sun',
    name: 'Solar Eclipse',
    category: 'Media / Entertainment',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="34" stroke="currentColor" stroke-width="6"/>
  <path d="M50 16C68.78 16 84 31.22 84 50C84 68.78 68.78 84 50 84C62 76 70 62 70 50C70 38 62 24 50 16Z" fill="currentColor"/>
</svg>`,
    pathData: 'M50 16C68.78 16 84 31.22 84 50C84 68.78 68.78 84 50 84C62 76 70 62 70 50C70 38 62 24 50 16Z',
  },
  {
    id: 'infinity-loop',
    name: 'Infinity Loop',
    category: 'Social / Network',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M30 35C21.72 35 15 41.72 15 50C15 58.28 21.72 65 30 65C38.6 65 44.5 59.5 50 50C55.5 40.5 61.4 35 70 35C78.28 35 85 41.72 85 50C85 58.28 78.28 65 70 65C61.4 65 55.5 59.5 50 50C44.5 40.5 38.6 35 30 35Z" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
    pathData: 'M30 35C21.72 35 15 41.72 15 50C15 58.28 21.72 65 30 65C38.6 65 44.5 59.5 50 50C55.5 40.5 61.4 35 70 35C78.28 35 85 41.72 85 50C85 58.28 78.28 65 70 65C61.4 65 55.5 59.5 50 50C44.5 40.5 38.6 35 30 35Z',
  },
  {
    id: 'ghost-phantom',
    name: 'Phantom Ghost',
    category: 'Gaming / Community',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M22 50C22 34.54 34.54 22 50 22C65.46 22 78 34.54 78 50V78L68 70L58 78L50 72L42 78L32 70L22 78V50Z" fill="currentColor"/>
  <circle cx="40" cy="46" r="5" fill="#09090B"/>
  <circle cx="60" cy="46" r="5" fill="#09090B"/>
</svg>`,
    pathData: 'M22 50C22 34.54 34.54 22 50 22C65.46 22 78 34.54 78 50V78L68 70L58 78L50 72L42 78L32 70L22 78V50Z',
  },
];

export function extractPathDataFromSvg(svgContent: string): string {
  const pathMatch = svgContent.match(/<path[^>]*d="([^"]+)"/i);
  if (pathMatch && pathMatch[1]) {
    return pathMatch[1];
  }
  return 'M50 10L85 85H15Z';
}
