import fs from 'node:fs';
import path from 'node:path';
import { DetectedStack, FrameworkType, AndroidStackInfo, IosStackInfo } from './types.js';

export async function detectProjectStack(targetPath: string): Promise<DetectedStack> {
  const root = path.resolve(targetPath);
  if (!fs.existsSync(root)) {
    throw new Error(`Target project directory does not exist: ${root}`);
  }

  let framework: FrameworkType = 'unknown';
  let appName = path.basename(root);
  const existingSplashPlugins: string[] = [];
  const recommendations: string[] = [];

  // 1. Detect Framework
  const pubspecPath = path.join(root, 'pubspec.yaml');
  const packageJsonPath = path.join(root, 'package.json');
  const rootManifestPath = path.join(root, 'app', 'src', 'main', 'AndroidManifest.xml');
  const hasAndroidRoot = fs.existsSync(rootManifestPath) || fs.existsSync(path.join(root, 'settings.gradle')) || fs.existsSync(path.join(root, 'settings.gradle.kts'));
  const hasIosRoot = fs.readdirSync(root).some(f => f.endsWith('.xcodeproj') || f.endsWith('.xcworkspace'));

  if (fs.existsSync(pubspecPath)) {
    framework = 'flutter';
    try {
      const pubspec = fs.readFileSync(pubspecPath, 'utf-8');
      const nameMatch = pubspec.match(/^name:\s*([a-zA-Z0-9_-]+)/m);
      if (nameMatch) appName = nameMatch[1];
      if (pubspec.includes('flutter_native_splash')) existingSplashPlugins.push('flutter_native_splash');
    } catch {
      // ignore
    }
  } else if (fs.existsSync(packageJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      if (pkg.name) appName = pkg.name;
      const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
      if (deps['react-native']) {
        framework = 'react-native';
        if (deps['react-native-splash-screen']) existingSplashPlugins.push('react-native-splash-screen');
        if (deps['react-native-bootsplash']) existingSplashPlugins.push('react-native-bootsplash');
      }
    } catch {
      // ignore
    }
  } else if (hasAndroidRoot) {
    framework = 'android-native';
  } else if (hasIosRoot) {
    framework = 'ios-native';
  }

  // 2. Android Stack Detection
  const androidCandidates = [
    path.join(root, 'android'),
    root,
  ];

  let androidDir: string | undefined;
  for (const cand of androidCandidates) {
    if (fs.existsSync(path.join(cand, 'app', 'src', 'main', 'AndroidManifest.xml')) ||
        fs.existsSync(path.join(cand, 'src', 'main', 'AndroidManifest.xml'))) {
      androidDir = cand;
      break;
    }
  }

  const android: AndroidStackInfo = { hasAndroid: !!androidDir };

  if (androidDir) {
    android.androidDir = androidDir;

    // Res directory
    const resCandidate1 = path.join(androidDir, 'app', 'src', 'main', 'res');
    const resCandidate2 = path.join(androidDir, 'src', 'main', 'res');
    if (fs.existsSync(resCandidate1)) android.resDir = resCandidate1;
    else if (fs.existsSync(resCandidate2)) android.resDir = resCandidate2;

    // Manifest path
    const manifestCandidate1 = path.join(androidDir, 'app', 'src', 'main', 'AndroidManifest.xml');
    const manifestCandidate2 = path.join(androidDir, 'src', 'main', 'AndroidManifest.xml');
    if (fs.existsSync(manifestCandidate1)) android.manifestPath = manifestCandidate1;
    else if (fs.existsSync(manifestCandidate2)) android.manifestPath = manifestCandidate2;

    // Read manifest to find package ID and theme
    if (android.manifestPath && fs.existsSync(android.manifestPath)) {
      try {
        const manifestContent = fs.readFileSync(android.manifestPath, 'utf-8');
        const pkgMatch = manifestContent.match(/package="([^"]+)"/);
        if (pkgMatch) android.packageId = pkgMatch[1];

        const themeMatch = manifestContent.match(/android:theme="([^"]+)"/);
        if (themeMatch) android.currentTheme = themeMatch[1];
      } catch {
        // ignore
      }
    }

    // Gradle build file
    const ktsFile = path.join(androidDir, 'app', 'build.gradle.kts');
    const groovyFile = path.join(androidDir, 'app', 'build.gradle');
    if (fs.existsSync(ktsFile)) {
      android.buildGradlePath = ktsFile;
      android.isKts = true;
    } else if (fs.existsSync(groovyFile)) {
      android.buildGradlePath = groovyFile;
      android.isKts = false;
    }

    // Check gradle for namespace/applicationId and core-splashscreen dependency
    if (android.buildGradlePath && fs.existsSync(android.buildGradlePath)) {
      try {
        const gradleContent = fs.readFileSync(android.buildGradlePath, 'utf-8');
        if (!android.packageId) {
          const nsMatch = gradleContent.match(/namespace\s*=?\s*['"]([^'"]+)['"]/);
          const appIdMatch = gradleContent.match(/applicationId\s*=?\s*['"]([^'"]+)['"]/);
          if (nsMatch) android.packageId = nsMatch[1];
          else if (appIdMatch) android.packageId = appIdMatch[1];
        }
        android.hasSplashScreenDependency = gradleContent.includes('androidx.core:core-splashscreen');
      } catch {
        // ignore
      }
    }

    // Locate MainActivity
    const searchDirs = [
      path.join(androidDir, 'app', 'src', 'main', 'kotlin'),
      path.join(androidDir, 'app', 'src', 'main', 'java'),
      path.join(androidDir, 'src', 'main', 'kotlin'),
      path.join(androidDir, 'src', 'main', 'java'),
    ];

    for (const sDir of searchDirs) {
      if (fs.existsSync(sDir)) {
        const found = findFileRecursive(sDir, (name) => name === 'MainActivity.kt' || name === 'MainActivity.java');
        if (found) {
          android.mainActivityPath = found;
          android.mainActivityLang = found.endsWith('.kt') ? 'kotlin' : 'java';
          break;
        }
      }
    }
  }

  // 3. iOS Stack Detection
  const iosCandidates = [
    path.join(root, 'ios'),
    root,
  ];

  let iosDir: string | undefined;
  for (const cand of iosCandidates) {
    if (fs.existsSync(cand)) {
      const files = fs.readdirSync(cand);
      if (files.some(f => f.endsWith('.xcodeproj') || f === 'Runner' || f.endsWith('.xcworkspace'))) {
        iosDir = cand;
        break;
      }
    }
  }

  const ios: IosStackInfo = { hasIos: !!iosDir };

  if (iosDir) {
    ios.iosDir = iosDir;

    // Look for LaunchScreen.storyboard
    const storyboard = findFileRecursive(iosDir, name => name === 'LaunchScreen.storyboard');
    if (storyboard) ios.storyboardPath = storyboard;

    // Look for Assets.xcassets
    const xcassets = findDirRecursive(iosDir, name => name === 'Assets.xcassets');
    if (xcassets) ios.xcassetsPath = xcassets;

    // Look for AppDelegate
    const appDelegate = findFileRecursive(iosDir, name => name === 'AppDelegate.swift' || name === 'AppDelegate.m' || name === 'AppDelegate.mm');
    if (appDelegate) {
      ios.appDelegatePath = appDelegate;
      ios.appDelegateLang = appDelegate.endsWith('.swift') ? 'swift' : 'objc';
    }

    // Look for Info.plist
    const infoPlist = findFileRecursive(iosDir, name => name === 'Info.plist');
    if (infoPlist) ios.infoPlistPath = infoPlist;
  }

  // 4. Formulate Recommendations
  if (android.hasAndroid) {
    if (!android.hasSplashScreenDependency) {
      recommendations.push(
        `Add androidx.core:core-splashscreen:1.0.1 dependency to ${android.isKts ? 'app/build.gradle.kts' : 'app/build.gradle'} for Android 12+ backwards compatibility.`
      );
    }
    if (android.currentTheme !== '@style/Theme.App.Starting') {
      recommendations.push(
        'Configure AndroidManifest.xml launcher activity to use Theme.App.Starting to avoid white flash on cold startup.'
      );
    }
  }

  if (ios.hasIos) {
    if (!ios.storyboardPath) {
      recommendations.push('Create LaunchScreen.storyboard in iOS target for instant zero-latency visual lock.');
    }
  }

  if (existingSplashPlugins.length > 0) {
    recommendations.push(
      `Detected legacy splash plugin (${existingSplashPlugins.join(', ')}). Native Splash Studio will upgrade this to 100% OS-level Android 12+ AnimatedVectorDrawable and iOS Storyboard without JS/Dart warm-up lag.`
    );
  }

  return {
    projectPath: root,
    framework,
    appName,
    android,
    ios,
    existingSplashPlugins,
    recommendations,
  };
}

function findFileRecursive(dir: string, predicate: (fileName: string) => boolean, depth = 0): string | undefined {
  if (depth > 6) return undefined;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isFile() && predicate(entry.name)) {
        return fullPath;
      } else if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'build') {
        const result = findFileRecursive(fullPath, predicate, depth + 1);
        if (result) return result;
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}

function findDirRecursive(dir: string, predicate: (dirName: string) => boolean, depth = 0): string | undefined {
  if (depth > 6) return undefined;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (predicate(entry.name)) return fullPath;
        if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'build') {
          const result = findDirRecursive(fullPath, predicate, depth + 1);
          if (result) return result;
        }
      }
    }
  } catch {
    // ignore
  }
  return undefined;
}
