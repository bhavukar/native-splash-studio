import fs from 'node:fs';
import path from 'node:path';
import { detectProjectStack } from './detector.js';
import { ValidationReport, ValidationIssue } from './types.js';

export async function validateSplashSetup(projectPath: string): Promise<ValidationReport> {
  const stack = await detectProjectStack(projectPath);
  const issues: ValidationIssue[] = [];
  const passedChecks: string[] = [];

  // Android Validation
  if (stack.android.hasAndroid) {
    const res = stack.android.resDir;
    if (res && fs.existsSync(res)) {
      // Check AVD
      const avdPath = path.join(res, 'drawable', 'avd_splash.xml');
      if (fs.existsSync(avdPath)) {
        passedChecks.push('Android: avd_splash.xml exists in drawable/');
      } else {
        issues.push({
          severity: 'error',
          component: 'android',
          message: 'Missing res/drawable/avd_splash.xml.',
          fix: 'Run inject_native_splash to generate AnimatedVectorDrawable.',
        });
      }

      // Check Vector Logo
      const logoPath = path.join(res, 'drawable', 'ic_splash_logo.xml');
      if (fs.existsSync(logoPath)) {
        passedChecks.push('Android: ic_splash_logo.xml exists in drawable/');
      } else {
        issues.push({
          severity: 'error',
          component: 'android',
          message: 'Missing res/drawable/ic_splash_logo.xml.',
          fix: 'Run inject_native_splash to generate vector logo.',
        });
      }

      // Check Animator
      const animPath = path.join(res, 'animator', 'splash_animator.xml');
      if (fs.existsSync(animPath)) {
        passedChecks.push('Android: splash_animator.xml exists in animator/');
      } else {
        issues.push({
          severity: 'error',
          component: 'android',
          message: 'Missing res/animator/splash_animator.xml.',
          fix: 'Run inject_native_splash to generate ObjectAnimator.',
        });
      }

      // Check Themes
      const themes1 = path.join(res, 'values', 'themes.xml');
      const themes2 = path.join(res, 'values', 'styles.xml');
      let foundStartingTheme = false;
      for (const tPath of [themes1, themes2]) {
        if (fs.existsSync(tPath)) {
          const content = fs.readFileSync(tPath, 'utf-8');
          if (content.includes('name="Theme.App.Starting"')) {
            foundStartingTheme = true;
            break;
          }
        }
      }

      if (foundStartingTheme) {
        passedChecks.push('Android: Theme.App.Starting is defined in values/themes.xml.');
      } else {
        issues.push({
          severity: 'error',
          component: 'android',
          message: 'Theme.App.Starting is not declared in res/values/themes.xml.',
          fix: 'Declare Theme.App.Starting extending Theme.SplashScreen.',
        });
      }
    } else {
      issues.push({
        severity: 'error',
        component: 'android',
        message: 'Could not locate Android res/ directory.',
        fix: 'Ensure your Android project structure includes app/src/main/res/.',
      });
    }

    // Check Manifest
    if (stack.android.manifestPath && fs.existsSync(stack.android.manifestPath)) {
      const manifest = fs.readFileSync(stack.android.manifestPath, 'utf-8');
      if (manifest.includes('@style/Theme.App.Starting')) {
        passedChecks.push('Android: AndroidManifest.xml uses Theme.App.Starting.');
      } else {
        issues.push({
          severity: 'warning',
          component: 'android',
          message: 'AndroidManifest.xml does not use @style/Theme.App.Starting on launch activity.',
          fix: 'Add android:theme="@style/Theme.App.Starting" to your launcher <activity>.',
        });
      }
    }

    // Check Gradle
    if (stack.android.hasSplashScreenDependency) {
      passedChecks.push('Android: androidx.core:core-splashscreen dependency is included in build.gradle.');
    } else {
      issues.push({
        severity: 'error',
        component: 'android',
        message: 'androidx.core:core-splashscreen dependency is missing.',
        fix: 'Add implementation("androidx.core:core-splashscreen:1.0.1") to app/build.gradle.kts.',
      });
    }

    // Check MainActivity
    if (stack.android.mainActivityPath && fs.existsSync(stack.android.mainActivityPath)) {
      const mainAct = fs.readFileSync(stack.android.mainActivityPath, 'utf-8');
      if (mainAct.includes('installSplashScreen()') || mainAct.includes('installSplashScreen(')) {
        passedChecks.push('Android: MainActivity calls installSplashScreen().');
      } else {
        issues.push({
          severity: 'warning',
          component: 'android',
          message: 'MainActivity does not call installSplashScreen() before super.onCreate().',
          fix: 'Call installSplashScreen() in onCreate() before super.onCreate(savedInstanceState).',
        });
      }
    }
  }

  // iOS Validation
  if (stack.ios.hasIos) {
    if (stack.ios.storyboardPath && fs.existsSync(stack.ios.storyboardPath)) {
      passedChecks.push('iOS: LaunchScreen.storyboard exists.');
    } else {
      issues.push({
        severity: 'warning',
        component: 'ios',
        message: 'Missing LaunchScreen.storyboard.',
        fix: 'Run inject_native_splash to create LaunchScreen.storyboard.',
      });
    }

    if (stack.ios.xcassetsPath && fs.existsSync(path.join(stack.ios.xcassetsPath, 'LaunchLogo.imageset'))) {
      passedChecks.push('iOS: LaunchLogo.imageset exists in Assets.xcassets.');
    } else {
      issues.push({
        severity: 'info',
        component: 'ios',
        message: 'Assets.xcassets/LaunchLogo.imageset is missing.',
        fix: 'Add LaunchLogo vector imageset to Assets.xcassets.',
      });
    }
  }

  const isFullyConfigured = issues.filter((i) => i.severity === 'error').length === 0;

  return {
    isFullyConfigured,
    framework: stack.framework,
    issues,
    passedChecks,
  };
}
