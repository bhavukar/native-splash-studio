import { AnimationTemplate } from './types';

export const ANIMATION_TEMPLATES: AnimationTemplate[] = [
  {
    id: 'spring-bloom',
    name: 'Spring Pop & Bloom',
    tagline: 'High-energy organic bounce with radial energy bloom',
    category: 'High Energy',
    defaultDurationMs: 850,
    description:
      'The logo bursts outward with an authentic spring overshoot (scale 0.35 to 1.12 to 1.0) while a luminous ambient ring blooms outward, settling with crisp micro-physics.',
    androidInterpolator: '@android:interpolator/overshoot',
    iosTimingCurve: 'CASpringAnimation(damping: 12, stiffness: 220)',
  },
  {
    id: 'path-trace',
    name: 'Vector Stroke Draw & Fill',
    tagline: 'Futuristic vector outline trace followed by solid ink fill',
    category: 'Modern',
    defaultDurationMs: 1000,
    description:
      'Uses trimPathEnd in Android AnimatedVectorDrawable and CAShapeLayer strokeEnd in iOS. The contour traces itself cleanly in 500ms, followed by an elegant alpha fill surge.',
    androidInterpolator: '@android:interpolator/fast_out_slow_in',
    iosTimingCurve: 'CAMediaTimingFunction(name: .easeInEaseOut)',
  },
  {
    id: 'apple-iris',
    name: 'Apple Iris & Aperture',
    tagline: 'Ultra-minimalist fluid scale and aperture reveal',
    category: 'Minimal',
    defaultDurationMs: 700,
    description:
      'Inspired by Apple flagship apps: a subtle 0.88x scale expansion paired with a smooth micro-blur dissipation that dissolves directly into the main view with zero perception delay.',
    androidInterpolator: 'pathInterpolator(controlX1=0.16, controlY1=1, controlX2=0.3, controlY2=1)',
    iosTimingCurve: 'UIViewPropertyAnimator(dampingRatio: 0.85, duration: 0.7)',
  },
  {
    id: 'sheen-3d',
    name: '3D Sheen & Hologram Flip',
    tagline: 'Rotational 3D entrance with diagonal light gleam',
    category: 'Luxury',
    defaultDurationMs: 900,
    description:
      'Flips seamlessly along the Y-axis from 60deg into flat perspective while a diagonal crystalline shimmer beam sweeps from top-left to bottom-right across the logo.',
    androidInterpolator: '@android:interpolator/decelerate_cubic',
    iosTimingCurve: 'CATransform3DMakeRotation(y-axis) + CAGradientLayer mask',
  },
  {
    id: 'liquid-ripple',
    name: 'Liquid Droplet & Ripple',
    tagline: 'Organic droplet drop with elastic squash & concentric waves',
    category: 'High Energy',
    defaultDurationMs: 950,
    description:
      'A fluid droplet descends from top, compresses on impact with authentic jelly squash (scaleY: 0.75, scaleX: 1.25), and rebounds into the logo as water ripples pulse out.',
    androidInterpolator: '@android:interpolator/bounce',
    iosTimingCurve: 'CAKeyframeAnimation(values: [0.3, 1.25, 0.9, 1.0])',
  },
  {
    id: 'neon-pulse',
    name: 'Neon Core & Luminescence',
    tagline: 'Bioluminescent multi-stage glow and focus lock',
    category: 'Modern',
    defaultDurationMs: 800,
    description:
      'The brand color radiates as an ambient backlight. The icon scales into view through a sharp luminescence flare, locking into crisp perfection with high contrast.',
    androidInterpolator: '@android:interpolator/accelerate_decelerate',
    iosTimingCurve: 'UIView.animateKeyframes with glowing layer shadowRadius',
  },
  {
    id: 'elastic-morph',
    name: 'Elastic Morph & Snap',
    tagline: 'Geometric tension compression snapping into logo geometry',
    category: 'High Energy',
    defaultDurationMs: 800,
    description:
      'Starts as a compressed geometric mass with elastic tension, then violently snaps outward into the final logo dimensions before settling with damped harmonic oscillation.',
    androidInterpolator: '@android:interpolator/anticipate_overshoot',
    iosTimingCurve: 'CASpringAnimation(mass: 1.2, damping: 9, stiffness: 300)',
  },
  {
    id: 'split-converge',
    name: 'Kinetic Split & Converge',
    tagline: 'Opposing directional halves converging with haptic lock',
    category: 'Modern',
    defaultDurationMs: 750,
    description:
      'Symmetric segments slide inward from negative and positive X-offsets at high initial velocity, colliding and merging seamlessly at center origin with a crisp micro-haptic stop.',
    androidInterpolator: '@android:interpolator/decelerate_quint',
    iosTimingCurve: 'UIViewPropertyAnimator with cubicBezier(0.2, 0.9, 0.1, 1.0)',
  },
  {
    id: 'glitch-velocity',
    name: 'Glitch Velocity & Decel',
    tagline: 'Cyberpunk horizontal micro-displacements locking to solid',
    category: 'Modern',
    defaultDurationMs: 650,
    description:
      'Rapid 3-phase horizontal micro-stutter with chromatic aberration displacement that abruptly decelerates into a rock-solid, crisp vector mark.',
    androidInterpolator: '@android:interpolator/linear_out_slow_in',
    iosTimingCurve: 'CAKeyframeAnimation(keyPath: "transform.translation.x")',
  },
  {
    id: 'radar-sweep',
    name: 'Radial Sweep & Reveal',
    tagline: '360-degree rotational angular radar reveal',
    category: 'Minimal',
    defaultDurationMs: 900,
    description:
      'A continuous 360-degree radial beam unmasks the logo geometry like a precision scanner radar, locking into full opacity on final pass.',
    androidInterpolator: '@android:interpolator/fast_out_linear_in',
    iosTimingCurve: 'CABasicAnimation(keyPath: "transform.rotation.z")',
  },
  {
    id: 'depth-parallax',
    name: 'Depth Parallax Dolly',
    tagline: 'Deep-space Z-axis push with camera inertia',
    category: 'Luxury',
    defaultDurationMs: 950,
    description:
      'Logo begins in deep 3D background space with optical depth-of-field, accelerating forward on the Z-axis toward the camera lens before braking smoothly into place.',
    androidInterpolator: '@android:interpolator/decelerate_quad',
    iosTimingCurve: 'CATransform3DScale + CATransform3DTranslate',
  },
  {
    id: 'minimal-strobe',
    name: 'Minimal Line Aperture',
    tagline: 'Horizontal light slit expanding into vertical silhouette',
    category: 'Minimal',
    defaultDurationMs: 700,
    description:
      'A razor-thin horizontal light beam flashes across the center equator, then snaps vertically open like an optical shutter to unveil the silhouette.',
    androidInterpolator: '@android:interpolator/fast_out_slow_in',
    iosTimingCurve: 'UIViewPropertyAnimator(duration: 0.7, curve: .easeInOut)',
  },
];
