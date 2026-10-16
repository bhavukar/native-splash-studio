export type FrameworkType = 'flutter' | 'react-native' | 'android-native' | 'ios-native' | 'unknown';

export interface AndroidStackInfo {
  hasAndroid: boolean;
  packageId?: string;
  appName?: string;
  androidDir?: string;
  resDir?: string;
  manifestPath?: string;
  mainActivityPath?: string;
  mainActivityLang?: 'kotlin' | 'java';
  buildGradlePath?: string;
  isKts?: boolean;
  hasSplashScreenDependency?: boolean;
  currentTheme?: string;
}

export interface IosStackInfo {
  hasIos: boolean;
  bundleId?: string;
  appName?: string;
  iosDir?: string;
  storyboardPath?: string;
  xcassetsPath?: string;
  appDelegatePath?: string;
  appDelegateLang?: 'swift' | 'objc';
  infoPlistPath?: string;
}

export interface DetectedStack {
  projectPath: string;
  framework: FrameworkType;
  appName: string;
  android: AndroidStackInfo;
  ios: IosStackInfo;
  existingSplashPlugins: string[];
  recommendations: string[];
}

export type AnimationCategory =
  | 'Minimal'
  | 'Modern'
  | 'Cinematic'
  | 'High Energy'
  | 'Luxury';

export interface AnimationTemplateInfo {
  id: string;
  name: string;
  tagline: string;
  category: AnimationCategory;
  defaultDurationMs: number;
  description: string;
  androidInterpolator: string;
  iosTimingCurve: string;
  features: string[];
}

export interface GeneratedFile {
  name: string;
  path: string;
  language: 'xml' | 'swift' | 'kotlin' | 'java' | 'json' | 'svg' | 'txt';
  content: string;
  description: string;
}

export interface SplashConfig {
  templateId: string;
  appName?: string;
  logoSvg?: string;
  logoFilePath?: string;
  backgroundColor?: string;
  accentColor?: string;
  durationMs?: number;
  themeMode?: 'light' | 'dark' | 'system';
}

export interface InjectionResult {
  success: boolean;
  projectPath: string;
  framework: FrameworkType;
  filesCreated: Array<{ path: string; description: string }>;
  filesModified: Array<{ path: string; summary: string }>;
  warnings: string[];
  verificationSteps: string[];
  dryRun: boolean;
}

export interface ValidationIssue {
  severity: 'error' | 'warning' | 'info';
  component: 'android' | 'ios' | 'general';
  message: string;
  fix: string;
}

export interface ValidationReport {
  isFullyConfigured: boolean;
  framework: FrameworkType;
  issues: ValidationIssue[];
  passedChecks: string[];
}
