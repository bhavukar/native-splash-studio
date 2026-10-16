export type DeviceType = 'iphone' | 'pixel';
export type ThemeMode = 'dark' | 'light';
export type PlatformType = 'android' | 'ios' | 'flutter' | 'react-native';

export type BackdropEffect =
  | 'none'
  | 'aurora'
  | 'particles'
  | 'shockwave'
  | 'lens-flare'
  | 'cyber-grid';

export type TitleAnimation =
  | 'none'
  | 'letter-stagger'
  | 'tracking-expand'
  | 'mask-slide';

export type ExitTransitionEffect =
  | 'dissolve'
  | 'zoom-aperture'
  | 'curtain-up';

export type AnimationTemplateId =
  | 'spring-bloom'
  | 'path-trace'
  | 'apple-iris'
  | 'sheen-3d'
  | 'liquid-ripple'
  | 'neon-pulse'
  | 'elastic-morph'
  | 'split-converge'
  | 'glitch-velocity'
  | 'radar-sweep'
  | 'depth-parallax'
  | 'minimal-strobe'
  | 'cosmic-burst'
  | 'liquid-aperture'
  | 'aurora-flare'
  | 'netflix-ribbon'
  | 'airbnb-breathe'
  | 'apple-intelligence'
  | 'spotify-waveform'
  | 'raycast-superconductor'
  | 'stripe-mesh'
  | 'linear-orbit'
  | 'uber-aperture'
  | 'matrix-decrypt';

export interface AnimationTemplate {
  id: AnimationTemplateId;
  name: string;
  tagline: string;
  category: 'Modern' | 'Minimal' | 'High Energy' | 'Luxury' | 'Cinematic';
  defaultDurationMs: number;
  description: string;
  androidInterpolator: string;
  iosTimingCurve: string;
  defaultBackdrop?: BackdropEffect;
  defaultTitleAnim?: TitleAnimation;
  defaultExit?: ExitTransitionEffect;
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
  backdropEffect: BackdropEffect;
  titleAnimation: TitleAnimation;
  exitTransition: ExitTransitionEffect;
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
