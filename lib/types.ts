export type DeviceType = 'iphone' | 'pixel';
export type ThemeMode = 'dark' | 'light';
export type PlatformType = 'android' | 'ios' | 'flutter' | 'react-native';

export type AnimationTemplateId =
  | 'spring-bloom'
  | 'path-trace'
  | 'apple-iris'
  | 'sheen-3d'
  | 'liquid-ripple'
  | 'neon-pulse';

export interface AnimationTemplate {
  id: AnimationTemplateId;
  name: string;
  tagline: string;
  category: 'Modern' | 'Minimal' | 'High Energy' | 'Luxury';
  defaultDurationMs: number;
  description: string;
  androidInterpolator: string;
  iosTimingCurve: string;
}

export interface StudioConfig {
  templateId: AnimationTemplateId;
  device: DeviceType;
  themeMode: ThemeMode;
  durationMs: number;
  backgroundColor: string;
  accentColor: string;
  logoScale: number; // 0.5 to 1.5
  logoSvg: string;
  logoName: string;
  appName: string;
  bundleId: string;
  showHomeScreenHandoff: boolean;
}

export interface GeneratedFile {
  name: string;
  path: string;
  language: 'xml' | 'swift' | 'kotlin' | 'json' | 'markdown';
  content: string;
  description: string;
}

export interface PlatformExport {
  platform: PlatformType;
  platformName: string;
  icon: string;
  summary: string;
  setupGuide: string[];
  files: GeneratedFile[];
}
