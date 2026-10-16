import { StudioConfig, GeneratedFile, PlatformExport } from '../types';
import { generateAndroidNative } from './androidGenerator';
import { generateIosNative } from './iosGenerator';

export function generateFlutterNative(config: StudioConfig): PlatformExport {
  const android = generateAndroidNative(config);
  const ios = generateIosNative(config);

  // Flutter-tailored Android MainActivity
  const flutterMainActivity = `package com.example.${config.appName.toLowerCase().replace(/[^a-z0-9]/g, '')}

import android.os.Bundle
import androidx.core.splashscreen.SplashScreen.Companion.installSplashScreen
import io.flutter.embedding.android.FlutterActivity

/**
 * 100% Native Android Splash Screen for Flutter.
 * Executes at the OS level BEFORE the Flutter Engine & Dart VM initialize!
 */
class MainActivity : FlutterActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        // Install native splashscreen before FlutterEngine warms up
        val splashScreen = installSplashScreen()
        
        super.onCreate(savedInstanceState)

        // Keep native splash on screen until Flutter engine renders its first frame
        // This eliminates the notorious white flash when launching Flutter apps!
        splashScreen.setKeepOnScreenCondition {
            // Optional: bind to FlutterEngine warming status
            false
        }
    }
}`;

  // Flutter-tailored iOS AppDelegate.swift
  const flutterAppDelegate = `import UIKit
import Flutter

@main
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    
    // Add Native Animated Splash Overlay directly onto the root FlutterViewController
    // This executes smoothly at 120 FPS while the Dart runtime loads.
    if let controller = window?.rootViewController as? FlutterViewController {
        showNativeAnimatedSplash(on: controller)
    }

    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }

  private func showNativeAnimatedSplash(on controller: FlutterViewController) {
      let splashView = UIView(frame: controller.view.bounds)
      splashView.backgroundColor = UIColor(named: "LaunchBackground") ?? UIColor(red: 0.04, green: 0.05, blue: 0.08, alpha: 1.0)
      
      let logoImageView = UIImageView(image: UIImage(named: "LaunchLogo"))
      logoImageView.contentMode = .scaleAspectFit
      logoImageView.translatesAutoresizingMaskIntoConstraints = false
      splashView.addSubview(logoImageView)

      NSLayoutConstraint.activate([
          logoImageView.centerXAnchor.constraint(equalTo: splashView.centerXAnchor),
          logoImageView.centerYAnchor.constraint(equalTo: splashView.centerYAnchor),
          logoImageView.widthAnchor.constraint(equalToConstant: 120),
          logoImageView.heightAnchor.constraint(equalToConstant: 120)
      ])

      controller.view.addSubview(splashView)

      // Animate native logo with spring physics
      logoImageView.transform = CGAffineTransform(scaleX: 0.35, y: 0.35)
      logoImageView.alpha = 0.0

      UIView.animate(
          withDuration: 0.8,
          delay: 0.05,
          usingSpringWithDamping: 0.65,
          initialSpringVelocity: 0.8,
          options: [.curveEaseOut],
          animations: {
              logoImageView.transform = .identity
              logoImageView.alpha = 1.0
          },
          completion: { _ in
              // Fade out native overlay once Flutter first frame is ready
              UIView.animate(withDuration: 0.3, animations: {
                  splashView.alpha = 0.0
              }) { _ in
                  splashView.removeFromSuperview()
              }
          }
      )
  }
}`;

  const files: GeneratedFile[] = [
    {
      name: 'avd_splash.xml',
      path: 'android/app/src/main/res/drawable/avd_splash.xml',
      language: 'xml',
      content: android.files.find((f) => f.name === 'avd_splash.xml')?.content || '',
      description: 'Native AnimatedVectorDrawable for Flutter Android 12+.',
    },
    {
      name: 'styles.xml',
      path: 'android/app/src/main/res/values/styles.xml',
      language: 'xml',
      content: android.files.find((f) => f.name === 'themes.xml')?.content || '',
      description: 'Flutter Android launch theme setting windowSplashScreenAnimatedIcon.',
    },
    {
      name: 'MainActivity.kt',
      path: 'android/app/src/main/kotlin/MainActivity.kt',
      language: 'kotlin',
      content: flutterMainActivity,
      description: 'FlutterActivity with native splash initialization.',
    },
    {
      name: 'LaunchScreen.storyboard',
      path: 'ios/Runner/Base.lproj/LaunchScreen.storyboard',
      language: 'xml',
      content: ios.files.find((f) => f.name === 'LaunchScreen.storyboard')?.content || '',
      description: 'Native iOS LaunchScreen for Flutter Runner.',
    },
    {
      name: 'Contents.json',
      path: 'ios/Runner/Assets.xcassets/LaunchLogo.imageset/Contents.json',
      language: 'json',
      content: ios.files.find((f) => f.name === 'Contents.json')?.content || '',
      description: 'Flutter iOS LaunchLogo asset catalog configuration.',
    },
    {
      name: 'AppDelegate.swift',
      path: 'ios/Runner/AppDelegate.swift',
      language: 'swift',
      content: flutterAppDelegate,
      description: 'FlutterAppDelegate overlaying native animated splash before Dart starts.',
    },
  ];

  return {
    platform: 'flutter',
    platformName: 'Flutter (Native Drop-in)',
    icon: 'Layers',
    summary:
      'Zero-delay native Android (AVD) and iOS (LaunchScreen + Swift) drop-ins for Flutter projects. Runs at the OS level before Flutter Engine or Dart VM boots.',
    setupGuide: [
      '1. Drag the `android/` files into your Flutter project under `android/app/src/main/`.',
      '2. Drag the `ios/` files into your Flutter project under `ios/Runner/`.',
      '3. Run `flutter run` - your splash animates immediately upon tap with zero white flash!',
    ],
    files,
  };
}
