/**
 * Color utility functions for contrast calculation, light/dark detection,
 * and adaptive color theme matching for native splash screens.
 */

export function isColorLight(hex: string): boolean {
  if (!hex || typeof hex !== 'string') return false;
  let clean = hex.trim().replace('#', '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  // ITU-R BT.709 perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

/**
 * Calculates WCAG 2.1 relative luminance and contrast ratio between two hex colors.
 */
export function getContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string) => {
    let clean = hex.trim().replace('#', '');
    if (clean.length === 3) {
      clean = clean
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (clean.length !== 6) return 0;
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;

    const [rLinear, gLinear, bLinear] = [r, g, b].map((v) =>
      v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
  };

  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Computes an effective logo color guaranteed to be visible against the background.
 * If user has white-on-white or black-on-black, flips automatically to ensure crisp visibility.
 */
export function getEffectiveLogoColor(backgroundColor: string, accentColor: string): string {
  const isBgLight = isColorLight(backgroundColor);
  const isAccentLight = isColorLight(accentColor);

  // If contrast ratio is critically low (< 2.0), flip neutral colors
  const contrast = getContrastRatio(backgroundColor, accentColor);
  if (contrast < 2.0) {
    return isBgLight ? '#09090B' : '#EDEDED';
  }

  // If background is light and accent is also light (e.g. white on white), enforce dark
  if (isBgLight && isAccentLight) {
    return '#09090B';
  }

  // If background is dark and accent is also dark (e.g. black on black), enforce light
  if (!isBgLight && !isAccentLight) {
    return '#EDEDED';
  }

  return accentColor;
}

/**
 * Returns synchronized theme colors when toggling device OS theme (dark <-> light).
 */
export function getAdaptiveThemeColors(
  targetMode: 'light' | 'dark',
  currentAccent: string
): { backgroundColor: string; accentColor: string } {
  if (targetMode === 'light') {
    const isCurrentAccentLight = isColorLight(currentAccent);
    // If current accent is a neutral light color (#FFFFFF, #EDEDED, #D4D4D8), flip to dark
    const nextAccent = isCurrentAccentLight ? '#09090B' : currentAccent;
    return {
      backgroundColor: '#FFFFFF',
      accentColor: nextAccent,
    };
  } else {
    const isCurrentAccentLight = isColorLight(currentAccent);
    // If current accent is a neutral dark color (#000000, #09090B, #121214, #27272A), flip to light
    const nextAccent = !isCurrentAccentLight ? '#EDEDED' : currentAccent;
    return {
      backgroundColor: '#09090B',
      accentColor: nextAccent,
    };
  }
}

/**
 * Sanitizes and prepares SVG markup to ensure it inherits the adaptive color properly.
 * Replaces hardcoded fills/strokes matching the background color with currentColor.
 */
export function prepareAdaptiveSvg(svg: string, isBgLight: boolean): string {
  if (!svg) return '';

  let sanitized = svg;

  if (isBgLight) {
    // If background is light, replace hardcoded white fills/strokes with currentColor
    sanitized = sanitized
      .replace(/fill="#(fff|ffffff|FFF|FFFFFF|ededed|EDEDED)"/g, 'fill="currentColor"')
      .replace(/fill="white"/gi, 'fill="currentColor"')
      .replace(/stroke="#(fff|ffffff|FFF|FFFFFF|ededed|EDEDED)"/g, 'stroke="currentColor"')
      .replace(/stroke="white"/gi, 'stroke="currentColor"');
  } else {
    // If background is dark, replace hardcoded black fills/strokes with currentColor
    sanitized = sanitized
      .replace(/fill="#(000|000000|09090B|0b0b0e|121214|18181B)"/g, 'fill="currentColor"')
      .replace(/fill="black"/gi, 'fill="currentColor"')
      .replace(/stroke="#(000|000000|09090B|0b0b0e|121214|18181B)"/g, 'stroke="currentColor"')
      .replace(/stroke="black"/gi, 'stroke="currentColor"');
  }

  return sanitized;
}
