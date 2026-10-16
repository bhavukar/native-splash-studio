import fs from 'node:fs';
import path from 'node:path';
import { detectProjectStack } from './detector.js';
import { generateAllSplashAssets } from './generator.js';
import { InjectionResult, SplashConfig } from './types.js';

export async function injectNativeSplash(
  projectPath: string,
  config: SplashConfig,
  dryRun = false
): Promise<InjectionResult> {
  const stack = await detectProjectStack(projectPath);
  const root = stack.projectPath;

  const filesCreated: Array<{ path: string; description: string }> = [];
  const filesModified: Array<{ path: string; summary: string }> = [];
  const warnings: string[] = [];
  const verificationSteps: string[] = [];

  // Read logo if file path provided
  let logoSvg = config.logoSvg;
  if (!logoSvg && config.logoFilePath) {
    const absLogoPath = path.resolve(root, config.logoFilePath);
    if (fs.existsSync(absLogoPath)) {
      logoSvg = fs.readFileSync(absLogoPath, 'utf-8');
    } else {
      warnings.push(`Specified logoFilePath not found: ${absLogoPath}. Using default studio brand mark.`);
    }
  }

  const effectiveConfig: SplashConfig = {
    ...config,
    appName: config.appName || stack.appName,
    logoSvg,
  };

  const bundle = generateAllSplashAssets(effectiveConfig, stack.framework);

  // Helper to safely write file
  const writeFileSafely = (filePath: string, content: string, description: string) => {
    const relPath = path.relative(root, filePath);
    if (!dryRun) {
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(filePath, content, 'utf-8');
    }
    filesCreated.push({ path: relPath, description });
  };

  // Helper to record file modification
  const modifyFileSafely = (filePath: string, newContent: string, summary: string) => {
    const relPath = path.relative(root, filePath);
    if (!dryRun) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
    }
    filesModified.push({ path: relPath, summary });
  };

  // ==========================================
  // 1. ANDROID INJECTION
  // ==========================================
  if (stack.android.hasAndroid && stack.android.resDir) {
    const res = stack.android.resDir;

    // Drawables
    const avdFile = bundle.files.find((f) => f.name === 'avd_splash.xml')!;
    writeFileSafely(path.join(res, 'drawable', 'avd_splash.xml'), avdFile.content, avdFile.description);

    const logoFile = bundle.files.find((f) => f.name === 'ic_splash_logo.xml')!;
    writeFileSafely(path.join(res, 'drawable', 'ic_splash_logo.xml'), logoFile.content, logoFile.description);

    // Animators
    const animFile = bundle.files.find((f) => f.name === 'splash_animator.xml')!;
    writeFileSafely(path.join(res, 'animator', 'splash_animator.xml'), animFile.content, animFile.description);

    // Values: colors.xml
    const colorsPath = path.join(res, 'values', 'colors.xml');
    const colorsFile = bundle.files.find((f) => f.name === 'colors.xml')!;
    if (fs.existsSync(colorsPath)) {
      const existing = fs.readFileSync(colorsPath, 'utf-8');
      if (!existing.includes('splash_background')) {
        const insertion = `\n    <!-- NativeSplash Studio Tokens -->\n    <color name="splash_background">${effectiveConfig.backgroundColor || '#0a0b10'}</color>\n    <color name="splash_accent">${effectiveConfig.accentColor || '#6366f1'}</color>\n    <color name="splash_logo_tint">#FFFFFF</color>\n`;
        const updated = existing.replace('</resources>', `${insertion}</resources>`);
        modifyFileSafely(colorsPath, updated, 'Merged splash color tokens into existing colors.xml');
      }
    } else {
      writeFileSafely(colorsPath, colorsFile.content, colorsFile.description);
    }

    // Values-night: colors.xml
    const colorsNightPath = path.join(res, 'values-night', 'colors.xml');
    const colorsNightFile = bundle.files.find((f) => f.name === 'colors-night.xml')!;
    if (fs.existsSync(colorsNightPath)) {
      const existing = fs.readFileSync(colorsNightPath, 'utf-8');
      if (!existing.includes('splash_background')) {
        const insertion = `\n    <!-- NativeSplash Studio Tokens (Night) -->\n    <color name="splash_background">${effectiveConfig.backgroundColor || '#090a0f'}</color>\n    <color name="splash_accent">${effectiveConfig.accentColor || '#6366f1'}</color>\n    <color name="splash_logo_tint">#FFFFFF</color>\n`;
        const updated = existing.replace('</resources>', `${insertion}</resources>`);
        modifyFileSafely(colorsNightPath, updated, 'Merged dark mode splash color tokens into existing values-night/colors.xml');
      }
    } else {
      writeFileSafely(colorsNightPath, colorsNightFile.content, colorsNightFile.description);
    }

    // Values: themes.xml / styles.xml
    const themesCandidate = path.join(res, 'values', 'themes.xml');
    const stylesCandidate = path.join(res, 'values', 'styles.xml');
    const targetThemesPath = fs.existsSync(themesCandidate) ? themesCandidate : stylesCandidate;
    const themesFile = bundle.files.find((f) => f.name === 'themes.xml')!;

    if (fs.existsSync(targetThemesPath)) {
      const existing = fs.readFileSync(targetThemesPath, 'utf-8');
      if (!existing.includes('name="Theme.App.Starting"')) {
        const themeSnippet = `\n    <!-- Splash Screen theme for Android 12+ SplashScreen API -->\n    <style name="Theme.App.Starting" parent="Theme.SplashScreen">\n        <item name="windowSplashScreenBackground">@color/splash_background</item>\n        <item name="windowSplashScreenAnimatedIcon">@drawable/avd_splash</item>\n        <item name="windowSplashScreenAnimationDuration">${effectiveConfig.durationMs || 850}</item>\n        <item name="postSplashScreenTheme">@style/Theme.${effectiveConfig.appName}</item>\n    </style>\n`;
        const updated = existing.replace('</resources>', `${themeSnippet}</resources>`);
        modifyFileSafely(targetThemesPath, updated, `Added Theme.App.Starting to ${path.basename(targetThemesPath)}`);
      }
    } else {
      writeFileSafely(themesCandidate, themesFile.content, themesFile.description);
    }

    // Values-night: themes.xml
    const themesNightPath = path.join(res, 'values-night', 'themes.xml');
    const themesNightFile = bundle.files.find((f) => f.name === 'themes-night.xml')!;
    if (fs.existsSync(themesNightPath)) {
      const existing = fs.readFileSync(themesNightPath, 'utf-8');
      if (!existing.includes('name="Theme.App.Starting"')) {
        const themeSnippet = `\n    <!-- Splash Screen theme for Android 12+ (Night) -->\n    <style name="Theme.App.Starting" parent="Theme.SplashScreen">\n        <item name="windowSplashScreenBackground">@color/splash_background</item>\n        <item name="windowSplashScreenAnimatedIcon">@drawable/avd_splash</item>\n        <item name="windowSplashScreenAnimationDuration">${effectiveConfig.durationMs || 850}</item>\n        <item name="postSplashScreenTheme">@style/Theme.${effectiveConfig.appName}</item>\n    </style>\n`;
        const updated = existing.replace('</resources>', `${themeSnippet}</resources>`);
        modifyFileSafely(themesNightPath, updated, 'Added Theme.App.Starting to values-night/themes.xml');
      }
    } else {
      writeFileSafely(themesNightPath, themesNightFile.content, themesNightFile.description);
    }

    // AndroidManifest.xml: Set Theme.App.Starting
    if (stack.android.manifestPath && fs.existsSync(stack.android.manifestPath)) {
      const manifest = fs.readFileSync(stack.android.manifestPath, 'utf-8');
      let updatedManifest = manifest;

      // Look for the launcher activity
      const launcherRegex = /(<activity[^>]*android:name="[^"]*"[^>]*>)([\s\S]*?<intent-filter>[\s\S]*?android\.intent\.action\.MAIN[\s\S]*?<\/intent-filter>[\s\S]*?)(<\/activity>)/;
      const match = updatedManifest.match(launcherRegex);

      if (match) {
        let activityTag = match[1];
        if (activityTag.includes('android:theme=')) {
          activityTag = activityTag.replace(/android:theme="[^"]*"/, 'android:theme="@style/Theme.App.Starting"');
        } else {
          activityTag = activityTag.replace('<activity', '<activity\n            android:theme="@style/Theme.App.Starting"');
        }
        updatedManifest = updatedManifest.replace(match[1], activityTag);
        modifyFileSafely(stack.android.manifestPath, updatedManifest, 'Configured launcher Activity with android:theme="@style/Theme.App.Starting"');
      } else if (!updatedManifest.includes('@style/Theme.App.Starting')) {
        warnings.push('Could not automatically identify launch Activity in AndroidManifest.xml. Please manually add android:theme="@style/Theme.App.Starting" to your main activity.');
      }
    }

    // Gradle: Add core-splashscreen dependency
    if (stack.android.buildGradlePath && fs.existsSync(stack.android.buildGradlePath)) {
      const gradle = fs.readFileSync(stack.android.buildGradlePath, 'utf-8');
      if (!gradle.includes('androidx.core:core-splashscreen')) {
        const depLine = stack.android.isKts
          ? '    implementation("androidx.core:core-splashscreen:1.0.1")\n'
          : "    implementation 'androidx.core:core-splashscreen:1.0.1'\n";

        if (gradle.includes('dependencies {')) {
          const updatedGradle = gradle.replace('dependencies {', `dependencies {\n${depLine}`);
          modifyFileSafely(stack.android.buildGradlePath, updatedGradle, 'Added androidx.core:core-splashscreen:1.0.1 to app dependencies');
        }
      }
    }

    // MainActivity: Add installSplashScreen()
    if (stack.android.mainActivityPath && fs.existsSync(stack.android.mainActivityPath)) {
      const mainAct = fs.readFileSync(stack.android.mainActivityPath, 'utf-8');
      let updatedMainAct = mainAct;

      if (!updatedMainAct.includes('installSplashScreen()') && !updatedMainAct.includes('installSplashScreen(')) {
        if (stack.android.mainActivityLang === 'kotlin') {
          // Add import
          if (!updatedMainAct.includes('import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen')) {
            updatedMainAct = updatedMainAct.replace(
              /(package\s+[^\n]+)/,
              '$1\n\nimport androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen'
            );
          }
          // Inject into onCreate
          if (updatedMainAct.includes('super.onCreate(')) {
            updatedMainAct = updatedMainAct.replace(
              /([ \t]*super\.onCreate\([^\)]*\))/,
              '        val splashScreen = installSplashScreen()\n$1'
            );
          }
          modifyFileSafely(stack.android.mainActivityPath, updatedMainAct, 'Wired installSplashScreen() before super.onCreate() in MainActivity.kt');
        } else if (stack.android.mainActivityLang === 'java') {
          // Java
          if (!updatedMainAct.includes('import androidx.core.splashscreen.SplashScreen;')) {
            updatedMainAct = updatedMainAct.replace(
              /(package\s+[^\n]+)/,
              '$1\n\nimport androidx.core.splashscreen.SplashScreen;'
            );
          }
          if (updatedMainAct.includes('super.onCreate(')) {
            updatedMainAct = updatedMainAct.replace(
              /([ \t]*super\.onCreate\([^\)]*\);)/,
              '        SplashScreen splashScreen = SplashScreen.installSplashScreen(this);\n$1'
            );
          }
          modifyFileSafely(stack.android.mainActivityPath, updatedMainAct, 'Wired SplashScreen.installSplashScreen(this) in MainActivity.java');
        }
      }
    }

    verificationSteps.push('Run Android app on Android 12+ (API 31+) device or emulator to test hardware-accelerated AnimatedVectorDrawable.');
  }

  // ==========================================
  // 2. iOS INJECTION
  // ==========================================
  if (stack.ios.hasIos && stack.ios.iosDir) {
    const iosDir = stack.ios.iosDir;

    // Determine target subfolder (e.g. Runner or appName)
    let targetSubDir = path.join(iosDir, 'Runner');
    if (!fs.existsSync(targetSubDir)) {
      const candidates = fs.readdirSync(iosDir, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.endsWith('.xcodeproj') && !d.name.endsWith('.xcworkspace') && d.name !== 'Pods')
        .map(d => path.join(iosDir, d.name));
      if (candidates.length > 0) targetSubDir = candidates[0];
      else targetSubDir = iosDir;
    }

    // Storyboard
    const storyboardFile = bundle.files.find((f) => f.name === 'LaunchScreen.storyboard')!;
    const storyboardDest = stack.ios.storyboardPath || path.join(targetSubDir, 'Base.lproj', 'LaunchScreen.storyboard');
    writeFileSafely(storyboardDest, storyboardFile.content, storyboardFile.description);

    // Assets.xcassets
    const xcassetsDir = stack.ios.xcassetsPath || path.join(targetSubDir, 'Assets.xcassets');
    const imagesetDir = path.join(xcassetsDir, 'LaunchLogo.imageset');

    const contentsJson = bundle.files.find((f) => f.name === 'Contents.json')!;
    writeFileSafely(path.join(imagesetDir, 'Contents.json'), contentsJson.content, contentsJson.description);

    const logoSvg = bundle.files.find((f) => f.name === 'LaunchLogo.svg')!;
    writeFileSafely(path.join(imagesetDir, 'LaunchLogo.svg'), logoSvg.content, logoSvg.description);

    // NativeSplashScreenView.swift
    const swiftOverlay = bundle.files.find((f) => f.name === 'NativeSplashScreenView.swift')!;
    writeFileSafely(path.join(targetSubDir, 'NativeSplashScreenView.swift'), swiftOverlay.content, swiftOverlay.description);

    verificationSteps.push('Build iOS target on iOS 16+ simulator or physical iPhone to verify zero-latency LaunchScreen storyboard lock and SwiftUI handoff.');
  }

  return {
    success: true,
    projectPath: root,
    framework: stack.framework,
    filesCreated,
    filesModified,
    warnings,
    verificationSteps,
    dryRun,
  };
}
