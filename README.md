# 🚀 NativeSplash Studio

> **Hardware-accelerated, zero-lag native animated splash screen studio for Android, iOS, Flutter, and React Native.**

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)
![React](https://img.shields.io/badge/React-19-cyan.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8.svg)
![Platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20Flutter%20%7C%20React%20Native-emerald.svg)

---

## 💡 Why This Project Exists (The Problem Nobody Solved)

Every mobile developer has encountered this frustration:

1. **The "Dart / JS Mistake"**: Writing an animated splash in `main.dart` or `App.tsx` forces the user to sit through a **500ms–1500ms ugly blank white or black window** while the Flutter Engine or Hermes JavaScript engine boots.
2. **Android 12+ SplashScreen Nightmare**: Android 12+ deprecated window background hacks and introduced `core-splashscreen` with `AnimatedVectorDrawable` (AVD). Writing AVD XML with `<objectAnimator>` files for path morphs, scales, and curves by hand is notoriously tedious and error-prone.
3. **iOS Launch Screen Restrictions**: Apple requires static `LaunchScreen.storyboard`. Creating a seamless 120 FPS ProMotion handoff to native Swift without a flicker is difficult to configure manually.
4. **Existing Tools Are Static**: Tools like `flutter_native_splash` and `react-native-bootsplash` only generate static images.

**NativeSplash Studio** lets you drop your logo (SVG or PNG), customize animations on a photorealistic **iPhone 16 Pro** or **Google Pixel 9** simulator, and export **100% native assets and code** in a single click.

---

## ✨ Features

- 📱 **Interactive Device Canvas**:
  - **iPhone 16 Pro** (Dynamic Island, Titanium bezels, ProMotion timing, iOS status bar).
  - **Google Pixel 9** (Obsidian bezels, centered punch-hole camera, Android gesture pill).
  - Dark Mode & Light Mode real-time preview.
  - Interactive timeline scrubber (scrub frame-by-frame through milliseconds).
  - Playback speed control (0.5x slow-mo, 1.0x real-time, 1.5x fast).
  - App Handoff simulator (see the exact cross-dissolve into your main UI).

- 🎨 **6 High-Precision Native Animation Presets**:
  1. **Spring Pop & Bloom**: Organic spring overshoot (`scale: 0.35 -> 1.12 -> 1.0`) with ambient energy bloom ring.
  2. **Vector Stroke Draw & Fill**: SVG contour stroke drawing (`trimPathEnd: 0 -> 1`) transitioning into solid color fill.
  3. **Apple Iris & Aperture**: Ultra-minimalist fluid scale and aperture reveal (`cubic-bezier(0.16, 1, 0.3, 1)`).
  4. **3D Sheen & Hologram Flip**: Y-axis perspective rotation paired with a diagonal crystalline light sweep.
  5. **Liquid Droplet & Ripple**: Fluid droplet falling into center, squashing on impact, and rebounding into logo as ripple waves expand.
  6. **Neon Core & Luminescence**: Bioluminescent ambient glow with luminescence contrast lock.

- 📦 **1-Click Multi-Platform Code & ZIP Export**:
  - **Android 12+ Native**: `res/drawable/avd_splash.xml`, `res/animator/`, `res/values/themes.xml`, `MainActivity.kt`.
  - **iOS Native**: `LaunchScreen.storyboard`, `Assets.xcassets`, `NativeSplashScreenView.swift`, `App.swift`.
  - **Flutter (Native Drop-in)**: Pre-structured files for `android/app/src/main/` and `ios/Runner/` running before Flutter Engine loads.
  - **React Native (Native Drop-in)**: Pre-structured files for `android/` and `ios/` running during Hermes bundle evaluation.
  - Full `.zip` package download powered by `jszip` with step-by-step `README.md`.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested with Node 22+)
- npm 9+

### Run Locally

```bash
cd /Users/bhavukarora/IdeaProjects/native-splash-studio
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

---

## 📁 Project Architecture

```
native-splash-studio/
├── app/
│   ├── globals.css              # Modern Tailwind 4 styling
│   ├── layout.tsx               # Root layout & SEO metadata
│   └── page.tsx                 # Main Studio workspace
├── components/
│   ├── AnimationCanvas.tsx      # Framer Motion native physics simulator
│   ├── CustomizationPanel.tsx   # Asset uploader, colors, and timing sliders
│   ├── DeviceFrame.tsx          # Realistic iPhone 16 Pro & Pixel 9 frames
│   ├── ExportModal.tsx          # Multi-platform code inspector & ZIP builder
│   ├── Navbar.tsx               # Studio header & primary actions
│   ├── PresetSelector.tsx       # Grid of the 6 animation presets
│   └── WhyNativeModal.tsx       # Interactive architecture comparison
├── lib/
│   ├── generators/
│   │   ├── androidGenerator.ts  # Android 12+ AVD & core-splashscreen generator
│   │   ├── iosGenerator.ts      # iOS LaunchScreen storyboard & Swift generator
│   │   ├── flutterGenerator.ts  # Flutter native folder drop-in generator
│   │   └── reactNativeGenerator.ts # React Native native drop-in generator
│   ├── sampleLogos.ts           # Curated vector SVG logos & parser
│   ├── templates.ts             # Animation preset physics definitions
│   ├── types.ts                 # TypeScript interfaces
│   └── zipExporter.ts           # JSZip automated packager
└── package.json
```

---

## 📄 License
MIT License. Created by Bhavuk Arora.
