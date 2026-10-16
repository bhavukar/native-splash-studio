import { StudioConfig, GeneratedFile, PlatformExport } from '../types';
import { generateAndroidNative } from './androidGenerator';
import { generateIosNative } from './iosGenerator';

export function generateReactNativeNative(config: StudioConfig): PlatformExport {
  const android = generateAndroidNative(config);
  const ios = generateIosNative(config);

  const rnMainActivity = `package com.example.${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '')}

import android.os.Bundle
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import com.facebook.react.ReactActivity

/**
 * 100% Native Android Splash for React Native.
 * Runs instantly at cold launch while the Hermes JavaScript engine loads the bundle.
 */
class MainActivity : ReactActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Native splash installed before ReactActivity initialization
        val splashScreen = installSplashScreen()

        super.onCreate(savedInstanceState)
    }

    override fun getMainComponentName(): String = "${config.appName}"
}`;

  const rnAppDelegateMm = `// iOS Native AppDelegate integration for React Native
#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"${config.appName}";
  self.initialProps = @{};

  // The native LaunchScreen.storyboard automatically handles the initial frame.
  // The system preserves the launch view until React Native root component mounts.
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end`;

  const files: GeneratedFile[] = [
    {
      name: 'avd_splash.xml',
      path: 'android/app/src/main/res/drawable/avd_splash.xml',
      language: 'xml',
      content: android.files.find((f) => f.name === 'avd_splash.xml')?.content || '',
      description: 'Native AnimatedVectorDrawable for React Native Android.',
    },
    {
      name: 'styles.xml',
      path: 'android/app/src/main/res/values/styles.xml',
      language: 'xml',
      content: android.files.find((f) => f.name === 'themes.xml')?.content || '',
      description: 'React Native Android launch theme configuring windowSplashScreenAnimatedIcon.',
    },
    {
      name: 'MainActivity.kt',
      path: 'android/app/src/main/java/MainActivity.kt',
      language: 'kotlin',
      content: rnMainActivity,
      description: 'ReactActivity configured with core-splashscreen.',
    },
    {
      name: 'LaunchScreen.storyboard',
      path: 'ios/LaunchScreen.storyboard',
      language: 'xml',
      content: ios.files.find((f) => f.name === 'LaunchScreen.storyboard')?.content || '',
      description: 'Native iOS LaunchScreen for React Native project.',
    },
    {
      name: 'AppDelegate.mm',
      path: 'ios/AppDelegate.mm',
      language: 'swift',
      content: rnAppDelegateMm,
      description: 'React Native iOS AppDelegate configuration.',
    },
    {
      name: 'Contents.json',
      path: 'ios/Images.xcassets/LaunchLogo.imageset/Contents.json',
      language: 'json',
      content: ios.files.find((f) => f.name === 'Contents.json')?.content || '',
      description: 'Asset catalog entry for LaunchLogo in React Native iOS.',
    },
  ];

  return {
    platform: 'react-native',
    platformName: 'React Native (Native Drop-in)',
    icon: 'Atom',
    summary:
      'Native Android 12+ and iOS launch screen drop-ins for React Native (Bare or Expo Prebuild). Displays seamlessly during JS bundle compilation.',
    setupGuide: [
      '1. Copy `android/` files into your project `android/app/src/main/`.',
      '2. Copy `ios/` files into your project `ios/`.',
      '3. Rebuild with `npx react-native run-android` or `npx react-native run-ios`.',
    ],
    files,
  };
}
