# @native-splash/mcp 🚀

Model Context Protocol (MCP) server for **Native Splash Studio**.
Enables AI coding assistants (Claude Desktop, Cursor, Google Antigravity, Cline) and autonomous agents to inspect any mobile codebase (Flutter, React Native, Android Native, iOS Native) and automatically generate and non-destructively inject 120 FPS native animated splash screens.

---

## 🛠 Features & Capabilities

- **🔍 Automated Stack Detection (`detect_project_stack`)**:
  - Detects framework (`flutter`, `react-native`, `android-native`, `ios-native`).
  - Discovers Android package ID, application ID, `res/` directories, `AndroidManifest.xml`, `MainActivity` (Kotlin/Java), and Gradle build scripts (`.kts` or Groovy).
  - Discovers iOS bundle ID, `LaunchScreen.storyboard`, `Assets.xcassets`, and `AppDelegate`.
  - Flags legacy splash plugins (`flutter_native_splash`, `react-native-splash-screen`, etc.).

- **🎨 24 Native Motion Engines (`list_native_templates`, `get_template_details`)**:
  - Minimal: Apple Iris, Organic Biometric Breathe, Camera Shutter Iris.
  - Modern: Vector Stroke Draw & Fill, Cyberpunk Neon Pulse, Geometric Morph & Bloom, Apple Intelligence Siri Halo, Planetary Gyroscope, Matrix Decrypt.
  - Cinematic: Cosmic Particle Convergence, Hyperdrive Stargate Warp, Cinematic Ribbon Unfurl.
  - High Energy: Spring Pop & Bloom, Liquid Droplet & Ripple, Hacker Cyber Glitch, Dynamic Gravity Rebound, Magnetic Resonance Fusion, Acoustic Waveform Harmonic, Superconductor Collider.
  - Luxury: 3D Sheen & Hologram Flip, Frosted Glass Disperse, Nordic Aurora Borealis, Iridescent Mesh Fluid.

- **⚡ Automated Non-Destructive Injection (`inject_native_splash`)**:
  - Generates Android 12+ AnimatedVectorDrawable (`avd_splash.xml`), Vector logo (`ic_splash_logo.xml`), and native `splash_animator.xml`.
  - Intelligently merges day and night color tokens into `res/values/colors.xml` and `res/values-night/colors.xml` without wiping existing resources.
  - Intelligently merges `Theme.App.Starting` into `themes.xml` or `styles.xml`.
  - Configures `AndroidManifest.xml` launcher activity to use `@style/Theme.App.Starting`.
  - Adds `androidx.core:core-splashscreen:1.0.1` dependency to `build.gradle` or `build.gradle.kts`.
  - Injects `installSplashScreen()` in `MainActivity.kt` or `MainActivity.java` before `super.onCreate()`.
  - Generates iOS `LaunchScreen.storyboard`, `Assets.xcassets/LaunchLogo.imageset`, and `NativeSplashScreenView.swift`.
  - Supports `dryRun: true` to preview changes before touching disk.

- **✅ Project Health Audit (`validate_splash_setup`)**:
  - Validates all files, styles, dependencies, and manifest declarations to guarantee zero white flashes or cold-boot stutters.

---

## 📦 Installation & Setup

### 1. Build Server
```bash
cd mcp
npm install
npm run build
```

### 2. Configure in Antigravity or Claude Desktop
Add to your `mcp_config.json` (or `claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "native-splash": {
      "command": "node",
      "args": [
        "/Users/bhavukarora/IdeaProjects/native-splash-studio/mcp/dist/index.js"
      ]
    }
  }
}
```

---

## 🤖 Available MCP Tools

| Tool | Description |
| :--- | :--- |
| `detect_project_stack` | Scans target project path to identify mobile stack, package name, and existing splash setup. |
| `list_native_templates` | Lists all 24 native motion engines with descriptions, categories, and physics interpolators. |
| `get_template_details` | Retrieves deep physics parameters and Android/iOS implementation specs for a template ID. |
| `generate_splash_assets` | Generates all native files for preview without writing to disk. |
| `inject_native_splash` | Safely and non-destructively injects splash assets, themes, and code into the mobile codebase. |
| `validate_splash_setup` | Runs an automated audit to verify splash wiring and catch cold-boot issues. |

---

## 📄 License
MIT
