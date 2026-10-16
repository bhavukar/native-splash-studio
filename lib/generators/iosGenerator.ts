import { StudioConfig, GeneratedFile, PlatformExport } from '../types';

export function generateIosNative(config: StudioConfig): PlatformExport {
  const durationSec = (config.durationMs / 1000).toFixed(2);
  const bgColor = config.backgroundColor;
  const accentColor = config.accentColor;

  // Convert Hex to RGB floats for storyboard
  const r = parseInt(bgColor.slice(1, 3), 16) / 255 || 0.05;
  const g = parseInt(bgColor.slice(3, 5), 16) / 255 || 0.06;
  const b = parseInt(bgColor.slice(5, 7), 16) / 255 || 0.09;

  // Storyboard XML
  const storyboardContent = `<?xml version="1.0" encoding="UTF-8"?>
<document type="com.apple.InterfaceBuilder3.CocoaTouch.Storyboard.XIB" version="3.0" toolsVersion="22154" targetRuntime="iOS.CocoaTouch" propertyAccessControl="none" useAutolayout="YES" launchScreen="YES" useTraitCollections="YES" useSafeAreas="YES" colorMatched="YES" initialViewController="01J-lp-oVM">
    <device id="retina6_12" orientation="portrait" appearance="light"/>
    <dependencies>
        <plugIn identifier="com.apple.InterfaceBuilder.IBCocoaTouchPlugin" version="22130"/>
        <capability name="Safe area layout guides" minToolsVersion="9.0"/>
        <capability name="documents saved in the Xcode 8 format" minToolsVersion="8.0"/>
    </dependencies>
    <scenes>
        <!--View Controller-->
        <scene sceneID="EHf-IW-A2E">
            <objects>
                <viewController id="01J-lp-oVM" sceneMemberID="viewController">
                    <view key="view" contentMode="scaleToFill" id="Ze5-6b-2t3">
                        <rect key="frame" x="0.0" y="0.0" width="393" height="852"/>
                        <autoresizingMask key="autoresizingMask" widthSizable="YES" heightSizable="YES"/>
                        <subviews>
                            <imageView clipsSubviews="YES" userInteractionEnabled="NO" contentMode="scaleAspectFit" horizontalHuggingPriority="251" verticalHuggingPriority="251" image="LaunchLogo" translatesAutoresizingMaskIntoConstraints="NO" id="YRO-k0-Ey4">
                                <rect key="frame" x="136.66666666666666" y="366" width="120" height="120"/>
                                <constraints>
                                    <constraint firstAttribute="width" constant="120" id="w120"/>
                                    <constraint firstAttribute="height" constant="120" id="h120"/>
                                </constraints>
                            </imageView>
                        </subviews>
                        <viewLayoutGuide key="safeArea" id="Bcu-3y-fUS"/>
                        <color key="backgroundColor" red="${r.toFixed(3)}" green="${g.toFixed(3)}" blue="${b.toFixed(3)}" alpha="1" colorSpace="custom" customColorSpace="sRGB"/>
                        <constraints>
                            <constraint firstItem="YRO-k0-Ey4" firstAttribute="centerX" secondItem="Ze5-6b-2t3" secondAttribute="centerX" id="centerX"/>
                            <constraint firstItem="YRO-k0-Ey4" firstAttribute="centerY" secondItem="Ze5-6b-2t3" secondAttribute="centerY" id="centerY"/>
                        </constraints>
                    </view>
                </viewController>
                <placeholder placeholderIdentifier="IBFirstResponder" id="iYj-Kq-Ea1" userLabel="First Responder" sceneMemberID="firstResponder"/>
            </objects>
            <point key="canvasLocation" x="53" y="375"/>
        </scene>
    </scenes>
    <resources>
        <image name="LaunchLogo" width="120" height="120"/>
    </resources>
</document>`;

  // Contents.json for Assets.xcassets
  const xcassetsJson = `{
  "images": [
    {
      "filename": "LaunchLogo.pdf",
      "idiom": "universal",
      "preserves-vector-representation": true
    }
  ],
  "info": {
    "author": "xcode",
    "version": 1
  },
  "properties": {
    "preserves-vector-representation": true
  }
}`;

  // Native SwiftUI / UIKit Animated Splash Screen Controller
  let animationLogicSwift = '';
  if (config.templateId === 'spring-bloom') {
    animationLogicSwift = `
        // Spring Pop with authentic Apple ProMotion physics
        withAnimation(.spring(response: 0.55, dampingFraction: 0.65, blendDuration: 0)) {
            logoScale = 1.0
            logoOpacity = 1.0
        }
        
        // Ambient Bloom Ring pulse
        withAnimation(.easeOut(duration: 0.8).delay(0.1)) {
            bloomScale = 2.4
            bloomOpacity = 0.0
        }`;
  } else if (config.templateId === 'path-trace') {
    animationLogicSwift = `
        // Vector Stroke Contour Drawing
        withAnimation(.easeInOut(duration: ${durationSec} * 0.65)) {
            strokeTrim = 1.0
        }
        
        // Dissolve into Solid Fill
        withAnimation(.easeIn(duration: ${durationSec} * 0.35).delay(${durationSec} * 0.55)) {
            logoOpacity = 1.0
        }`;
  } else if (config.templateId === 'sheen-3d') {
    animationLogicSwift = `
        // 3D Perspective Flip along Y-Axis
        withAnimation(.interpolatingSpring(stiffness: 140, damping: 14)) {
            rotationY = 0.0
            logoScale = 1.0
            logoOpacity = 1.0
        }
        
        // Diagonal crystalline sheen sweep
        withAnimation(.linear(duration: 0.65).delay(0.2)) {
            sheenOffset = 2.0
        }`;
  } else if (config.templateId === 'liquid-ripple') {
    animationLogicSwift = `
        // Liquid Drop with squash and stretch
        withAnimation(.easeIn(duration: 0.3)) {
            dropOffsetY = 0
        }
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.3) {
            withAnimation(.spring(response: 0.4, dampingFraction: 0.5)) {
                logoScale = 1.0
                logoOpacity = 1.0
            }
            withAnimation(.easeOut(duration: 0.7)) {
                rippleScale = 2.5
                rippleOpacity = 0.0
            }
        }`;
  } else {
    // Apple Iris / Minimal
    animationLogicSwift = `
        // Apple Iris: seamless scale & micro-fade
        withAnimation(.timingCurve(0.16, 1.0, 0.3, 1.0, duration: ${durationSec})) {
            logoScale = 1.0
            logoOpacity = 1.0
        }`;
  }

  const swiftUiSplashContent = `import SwiftUI

/**
 * Native iOS Animated Splash Screen.
 * Handcrafted for seamless 120 FPS handoff from LaunchScreen.storyboard.
 */
public struct NativeSplashScreenView<Content: View>: View {
    @ViewBuilder let content: () -> Content
    
    @State private var isSplashFinished: Bool = false
    @State private var logoScale: CGFloat = ${config.templateId === 'apple-iris' ? '0.85' : '0.35'}
    @State private var logoOpacity: Double = 0.0
    @State private var bloomScale: CGFloat = 0.8
    @State private var bloomOpacity: Double = 0.8
    @State private var strokeTrim: CGFloat = 0.0
    @State private var rotationY: Double = -65.0
    @State private var sheenOffset: CGFloat = -1.5
    @State private var dropOffsetY: CGFloat = -120.0
    @State private var rippleScale: CGFloat = 0.6
    @State private var rippleOpacity: Double = 0.9

    private let splashDuration: Double = ${durationSec}
    private let backgroundColor = Color(red: ${r.toFixed(3)}, green: ${g.toFixed(3)}, blue: ${b.toFixed(3)})
    private let accentColor = Color(hex: "${accentColor}")

    public init(@ViewBuilder content: @escaping () -> Content) {
        self.content = content
    }

    public var body: some View {
        ZStack {
            // Main App Root View (pre-warmed underneath)
            content()

            // Native Splash Overlay
            if !isSplashFinished {
                ZStack {
                    backgroundColor
                        .ignoresSafeArea()

                    // Ambient Bloom / Ripple Wave
                    Circle()
                        .fill(accentColor.opacity(0.35))
                        .frame(width: 140, height: 140)
                        .scaleEffect(bloomScale)
                        .opacity(bloomOpacity)
                        .blur(radius: 20)

                    // The Animated Logo (Matching LaunchScreen geometry exactly)
                    Image("LaunchLogo")
                        .resizable()
                        .renderingMode(.template)
                        .foregroundColor(accentColor)
                        .aspectRatio(contentMode: .fit)
                        .frame(width: 120, height: 120)
                        .scaleEffect(logoScale)
                        .opacity(logoOpacity)
                        .rotation3DEffect(.degrees(rotationY), axis: (x: 0, y: 1, z: 0))
                        .offset(y: config.templateId == "liquid-ripple" ? dropOffsetY : 0)
                }
                .transition(.opacity.animation(.easeInOut(duration: 0.35)))
                .zIndex(999)
            }
        }
        .onAppear {
            startNativeAnimation()
        }
    }

    private func startNativeAnimation() {
        ${animationLogicSwift}

        // Seamless exit transition to main app
        DispatchQueue.main.asyncAfter(deadline: .now() + splashDuration) {
            withAnimation(.easeInOut(duration: 0.35)) {
                isSplashFinished = true
            }
        }
    }
}

// Hex Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let r, g, b: UInt64
        switch hex.count {
        case 6:
            (r, g, b) = ((int >> 16) & 0xFF, (int >> 8) & 0xFF, int & 0xFF)
        default:
            (r, g, b) = (255, 255, 255)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: 1
        )
    }
}`;

  // AppDelegate / App.swift Integration
  const appSwiftContent = `import SwiftUI

@main
struct YourApp: App {
    var body: some Scene {
        WindowGroup {
            NativeSplashScreenView {
                // Your app root view
                ContentView()
            }
        }
    }
}`;

  const files: GeneratedFile[] = [
    {
      name: 'LaunchScreen.storyboard',
      path: 'Base.lproj/LaunchScreen.storyboard',
      language: 'xml',
      content: storyboardContent,
      description: 'iOS system launch screen XML with pixel-perfect matching geometry.',
    },
    {
      name: 'Contents.json',
      path: 'Assets.xcassets/LaunchLogo.imageset/Contents.json',
      language: 'json',
      content: xcassetsJson,
      description: 'Asset catalog entry preserving high-resolution vector representation.',
    },
    {
      name: 'NativeSplashScreenView.swift',
      path: 'Views/NativeSplashScreenView.swift',
      language: 'swift',
      content: swiftUiSplashContent,
      description: 'Hardware-accelerated native animation controller matching the selected template.',
    },
    {
      name: 'YourApp.swift',
      path: 'App/YourApp.swift',
      language: 'swift',
      content: appSwiftContent,
      description: 'Clean @main app entry point wrapping the root view with the native splash.',
    },
  ];

  return {
    platform: 'ios',
    platformName: 'iOS Native',
    icon: 'Apple',
    summary:
      'Native iOS launch screen with zero-delay SpringBoard handoff using LaunchScreen.storyboard and Swift 120 FPS ProMotion animation.',
    setupGuide: [
      '1. Drag `LaunchScreen.storyboard` into your Xcode project (replace existing one).',
      '2. Add `LaunchLogo` image/PDF to your `Assets.xcassets`.',
      '3. Copy `NativeSplashScreenView.swift` into your Xcode project.',
      '4. Wrap your root view inside `NativeSplashScreenView { ContentView() }`.',
    ],
    files,
  };
}
