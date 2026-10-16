'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudioConfig } from '../lib/types';
import { isColorLight, getEffectiveLogoColor, prepareAdaptiveSvg } from '../lib/colors';
import { VectorSvgAnimator } from './VectorSvgAnimator';

interface AnimationCanvasProps {
  config: StudioConfig;
  isPlaying: boolean;
  scrubProgress: number | null; // 0 to 1, or null if playing
  onComplete?: () => void;
  replayNonce: number;
}

const PARTICLE_POSITIONS = [
  { startX: -130, startY: -160, size: 4 },
  { startX: 120, startY: -150, size: 3 },
  { startX: -150, startY: 130, size: 5 },
  { startX: 140, startY: 150, size: 4 },
  { startX: 0, startY: -190, size: 3 },
  { startX: 0, startY: 190, size: 4 },
  { startX: -170, startY: 0, size: 3 },
  { startX: 170, startY: 0, size: 4 },
  { startX: -90, startY: -90, size: 5 },
  { startX: 90, startY: -100, size: 3 },
  { startX: -80, startY: 80, size: 4 },
  { startX: 100, startY: 70, size: 3 },
  { startX: -50, startY: -130, size: 4 },
  { startX: 60, startY: 120, size: 4 },
];

export function AnimationCanvas({
  config,
  isPlaying,
  scrubProgress,
  onComplete,
  replayNonce,
}: AnimationCanvasProps) {
  const [finishedNonce, setFinishedNonce] = useState<number>(-1);
  const animationFinished = finishedNonce === replayNonce;

  useEffect(() => {
    if (!isPlaying && scrubProgress === null) return;

    const timer = setTimeout(() => {
      setFinishedNonce(replayNonce);
      if (onComplete) onComplete();
    }, config.durationMs + 200);

    return () => clearTimeout(timer);
  }, [replayNonce, isPlaying, scrubProgress, config.durationMs, onComplete]);

  const durationSec = config.durationMs / 1000;
  const logoSize = 110 * config.logoScale;
  const isBgLight = isColorLight(config.backgroundColor);
  const effectiveAccentColor = getEffectiveLogoColor(config.backgroundColor, config.accentColor);
  const adaptiveSvg = prepareAdaptiveSvg(config.logoSvg, isBgLight);
  const textColor = isBgLight ? '#09090B' : '#EDEDED';

  // Render template-specific animation
  const renderTemplateVisuals = () => {
    switch (config.templateId) {
      case 'spring-bloom':
        return (
          <div className="relative flex items-center justify-center">
            {/* Ambient Bloom Ring */}
            <motion.div
              key={`bloom-${replayNonce}`}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.4 + scrubProgress * 1.8,
                      opacity: Math.max(0, 0.3 - scrubProgress * 0.3),
                    }
                  : {
                      scale: [0.4, 1.2, 1.8],
                      opacity: [0, 0.3, 0],
                    }
              }
              transition={{
                duration: durationSec,
                ease: 'easeOut',
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: logoSize * 1.5,
                height: logoSize * 1.5,
                background: `radial-gradient(circle, ${effectiveAccentColor} 0%, transparent 70%)`,
                filter: 'blur(16px)',
              }}
            />

            {/* Spring Bounce Logo */}
            <motion.div
              key={`logo-${replayNonce}`}
              initial={{ scale: 0.25, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: Math.min(
                        1.0,
                        0.25 + scrubProgress * 0.95 + (scrubProgress > 0.6 && scrubProgress < 0.9 ? 0.08 : 0)
                      ),
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      scale: [0.25, 1.12, 0.97, 1.0],
                      opacity: [0, 1, 1, 1],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.6, 0.85, 1],
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center drop-shadow-xl"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'path-trace':
        return (
          <div className="relative flex items-center justify-center">
            {/* Trace Glow */}
            <motion.div
              key={`trace-glow-${replayNonce}`}
              initial={{ opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? { opacity: scrubProgress > 0.5 ? 0.4 : 0 }
                  : { opacity: [0, 0, 0.5, 0.2] }
              }
              transition={{ duration: durationSec }}
              className="absolute rounded-full blur-xl pointer-events-none"
              style={{
                width: logoSize * 1.5,
                height: logoSize * 1.5,
                backgroundColor: effectiveAccentColor,
              }}
            />

            {/* Path Stroke Draw to Fill */}
            <div
              key={`trace-logo-${replayNonce}`}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center filter drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <VectorSvgAnimator
                svgString={config.logoSvg}
                accentColor={effectiveAccentColor}
                durationSec={durationSec}
                scrubProgress={scrubProgress}
                replayNonce={replayNonce}
                templateId="path-trace"
                isBgLight={isBgLight}
              />
            </div>
          </div>
        );

      case 'sheen-3d':
        return (
          <div className="relative flex items-center justify-center [perspective:800px]">
            {/* 3D Rotating Logo */}
            <motion.div
              key={`sheen-logo-${replayNonce}`}
              initial={{ rotateY: -65, scale: 0.6, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      rotateY: -65 + scrubProgress * 65,
                      scale: 0.6 + scrubProgress * 0.4,
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      rotateY: [-65, 0],
                      scale: [0.6, 1],
                      opacity: [0, 1],
                    }
              }
              transition={{
                duration: durationSec,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center overflow-hidden rounded-2xl"
            >
              <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
              />

              {/* Diagonal Light Sheen */}
              <motion.div
                key={`sheen-light-${replayNonce}`}
                initial={{ x: '-150%', y: '-150%' }}
                animate={
                  scrubProgress !== null
                    ? {
                        x: `${-150 + scrubProgress * 300}%`,
                        y: `${-150 + scrubProgress * 300}%`,
                      }
                    : {
                        x: ['-150%', '150%'],
                        y: ['-150%', '150%'],
                      }
                }
                transition={{
                  duration: durationSec * 0.85,
                  delay: durationSec * 0.15,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.7) 50%, transparent 80%)',
                  mixBlendMode: 'overlay',
                }}
              />
            </motion.div>
          </div>
        );

      case 'liquid-ripple':
        return (
          <div className="relative flex items-center justify-center">
            {/* Concentric Water Waves */}
            <motion.div
              key={`ripple-1-${replayNonce}`}
              initial={{ scale: 0.2, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.2 + scrubProgress * 2.5,
                      opacity: Math.max(0, 0.8 - scrubProgress * 0.8),
                    }
                  : {
                      scale: [0.2, 2.2],
                      opacity: [0, 0.7, 0],
                    }
              }
              transition={{
                duration: durationSec * 0.9,
                delay: durationSec * 0.2,
                ease: 'easeOut',
              }}
              className="absolute rounded-full border-2 border-current pointer-events-none"
              style={{
                width: logoSize * 1.2,
                height: logoSize * 1.2,
                color: effectiveAccentColor,
              }}
            />

            {/* Droplet Descent & Jelly Bounce */}
            <motion.div
              key={`liquid-drop-${replayNonce}`}
              initial={{ y: -90, scaleY: 1.4, scaleX: 0.7, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      y: Math.max(0, -90 + scrubProgress * 120),
                      scaleY: scrubProgress > 0.4 ? 1.0 : 1.4,
                      scaleX: scrubProgress > 0.4 ? 1.0 : 0.7,
                      opacity: Math.min(1, scrubProgress * 2.5),
                    }
                  : {
                      y: [-90, 0, -8, 0],
                      scaleY: [1.4, 0.8, 1.05, 1.0],
                      scaleX: [0.7, 1.25, 0.95, 1.0],
                      opacity: [0, 1, 1, 1],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.45, 0.75, 1],
                ease: 'easeOut',
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'neon-pulse':
        return (
          <div className="relative flex items-center justify-center">
            {/* Ambient Neon Aura */}
            <motion.div
              key={`neon-aura-${replayNonce}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.5 + scrubProgress * 1.5,
                      opacity: Math.sin(scrubProgress * Math.PI) * 0.9,
                    }
                  : {
                      scale: [0.5, 1.3, 1.8],
                      opacity: [0, 0.8, 0.3],
                    }
              }
              transition={{
                duration: durationSec,
                ease: 'easeInOut',
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: logoSize * 1.8,
                height: logoSize * 1.8,
                background: `radial-gradient(circle, ${effectiveAccentColor} 0%, transparent 70%)`,
                filter: 'blur(32px)',
              }}
            />

            {/* Neon Pulse Logo */}
            <motion.div
              key={`neon-logo-${replayNonce}`}
              initial={{ scale: 0.7, opacity: 0, filter: 'brightness(2)' }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.7 + scrubProgress * 0.3,
                      opacity: Math.min(1, scrubProgress * 2),
                      filter: `brightness(${Math.max(1, 2 - scrubProgress * 1)})`,
                    }
                  : {
                      scale: [0.7, 1.05, 1.0],
                      opacity: [0, 1, 1],
                      filter: ['brightness(2.2)', 'brightness(1.4)', 'brightness(1)'],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.7, 1],
                ease: 'easeOut',
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center drop-shadow-[0_0_20px_currentColor]"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'elastic-morph':
        return (
          <div className="relative flex items-center justify-center">
            {/* Elastic Snap Logo */}
            <motion.div
              key={`elastic-logo-${replayNonce}`}
              initial={{ scaleX: 0.1, scaleY: 1.8, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scaleX: 0.1 + scrubProgress * 0.9,
                      scaleY: Math.max(1, 1.8 - scrubProgress * 0.8),
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      scaleX: [0.1, 1.35, 0.92, 1.0],
                      scaleY: [1.8, 0.75, 1.06, 1.0],
                      opacity: [0, 1, 1, 1],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.55, 0.82, 1],
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'split-converge':
        return (
          <div className="relative flex items-center justify-center overflow-hidden" style={{ width: logoSize * 1.5, height: logoSize * 1.5 }}>
            {/* Left Converging Half */}
            <motion.div
              key={`converge-left-${replayNonce}`}
              initial={{ x: -100, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      x: Math.min(0, -100 + scrubProgress * 100),
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      x: [-100, 4, 0],
                      opacity: [0, 1, 1],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.75, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute flex items-center justify-center"
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
                clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
              }}
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />

            {/* Right Converging Half */}
            <motion.div
              key={`converge-right-${replayNonce}`}
              initial={{ x: 100, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      x: Math.max(0, 100 - scrubProgress * 100),
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      x: [100, -4, 0],
                      opacity: [0, 1, 1],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.75, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              className="absolute flex items-center justify-center"
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
                clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
              }}
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'glitch-velocity':
        return (
          <div className="relative flex items-center justify-center">
            {/* Micro-stutter Shadow Displacement */}
            <motion.div
              key={`glitch-shadow-${replayNonce}`}
              initial={{ x: -8, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      x: scrubProgress > 0.6 ? 0 : -8 + scrubProgress * 12,
                      opacity: scrubProgress > 0.6 ? 0 : 0.4,
                    }
                  : {
                      x: [-8, 6, -4, 2, 0],
                      opacity: [0, 0.5, 0.3, 0.1, 0],
                    }
              }
              transition={{ duration: durationSec * 0.7, ease: 'easeOut' }}
              className="absolute opacity-40 blur-[1px] pointer-events-none"
              style={{
                width: logoSize,
                height: logoSize,
                color: '#38BDF8',
              }}
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />

            {/* Main Logo Decel Lock */}
            <motion.div
              key={`glitch-main-${replayNonce}`}
              initial={{ x: 12, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      x: scrubProgress > 0.7 ? 0 : (1 - scrubProgress) * 12,
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      x: [12, -6, 4, -2, 0],
                      opacity: [0, 0.8, 1, 1, 1],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.3, 0.6, 0.8, 1],
                ease: 'easeOut',
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'radar-sweep':
        return (
          <div className="relative flex items-center justify-center">
            {/* Sweep Beam Glow */}
            <motion.div
              key={`radar-beam-${replayNonce}`}
              initial={{ rotate: 0, opacity: 0.8 }}
              animate={
                scrubProgress !== null
                  ? { rotate: scrubProgress * 360, opacity: Math.max(0, 0.8 - scrubProgress * 0.8) }
                  : { rotate: [0, 360], opacity: [0.8, 0] }
              }
              transition={{ duration: durationSec, ease: 'linear' }}
              className="absolute pointer-events-none rounded-full"
              style={{
                width: logoSize * 1.6,
                height: logoSize * 1.6,
                background: `conic-gradient(from 0deg, transparent 270deg, ${effectiveAccentColor} 360deg)`,
                opacity: 0.3,
              }}
            />

            {/* Logo Masked Reveal */}
            <motion.div
              key={`radar-logo-${replayNonce}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                scrubProgress !== null
                  ? { opacity: Math.min(1, scrubProgress * 1.5), scale: 0.9 + scrubProgress * 0.1 }
                  : { opacity: [0, 0.7, 1], scale: [0.9, 0.98, 1.0] }
              }
              transition={{ duration: durationSec, ease: 'easeOut' }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'depth-parallax':
        return (
          <div className="relative flex items-center justify-center [perspective:1000px]">
            {/* Z-Axis Forward Camera Dolly Push */}
            <motion.div
              key={`depth-logo-${replayNonce}`}
              initial={{ scale: 0.08, opacity: 0, filter: 'blur(10px)' }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.08 + scrubProgress * 0.92,
                      opacity: Math.min(1, scrubProgress * 2),
                      filter: `blur(${Math.max(0, 10 - scrubProgress * 12)}px)`,
                    }
                  : {
                      scale: [0.08, 1.08, 1.0],
                      opacity: [0, 1, 1],
                      filter: ['blur(10px)', 'blur(0px)', 'blur(0px)'],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.75, 1],
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'minimal-strobe':
        return (
          <div className="relative flex items-center justify-center overflow-hidden" style={{ width: logoSize * 1.4, height: logoSize * 1.4 }}>
            {/* Center Razor Light Slit */}
            <motion.div
              key={`strobe-line-${replayNonce}`}
              initial={{ scaleX: 0, opacity: 1 }}
              animate={
                scrubProgress !== null
                  ? {
                      scaleX: scrubProgress < 0.4 ? scrubProgress * 2.5 : 1,
                      opacity: scrubProgress > 0.5 ? 0 : 1,
                    }
                  : {
                      scaleX: [0, 1, 1],
                      opacity: [1, 1, 0],
                    }
              }
              transition={{ duration: durationSec * 0.5, times: [0, 0.7, 1], ease: 'easeInOut' }}
              className="absolute h-[1.5px] inset-x-0 z-20 pointer-events-none"
              style={{ backgroundColor: effectiveAccentColor }}
            />

            {/* Aperture Vertical Expansion Logo */}
            <motion.div
              key={`strobe-logo-${replayNonce}`}
              initial={{ clipPath: 'inset(50% 0 50% 0)', opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      clipPath: `inset(${Math.max(0, 50 - scrubProgress * 60)}% 0 ${Math.max(0, 50 - scrubProgress * 60)}% 0)`,
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      clipPath: ['inset(50% 0 50% 0)', 'inset(0% 0 0% 0)'],
                      opacity: [0, 1],
                    }
              }
              transition={{
                duration: durationSec * 0.75,
                delay: durationSec * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'cosmic-burst':
        return (
          <div className="relative flex items-center justify-center">
            {/* Ambient Energy Flare */}
            <motion.div
              key={`cosmic-flare-${replayNonce}`}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.1 + scrubProgress * 2.5,
                      opacity: Math.sin(scrubProgress * Math.PI) * 0.7,
                    }
                  : {
                      scale: [0.1, 1.8, 2.5],
                      opacity: [0, 0.7, 0],
                    }
              }
              transition={{ duration: durationSec, ease: 'easeOut' }}
              className="absolute rounded-full pointer-events-none blur-xl"
              style={{
                width: logoSize * 1.5,
                height: logoSize * 1.5,
                background: `radial-gradient(circle, ${effectiveAccentColor} 0%, transparent 70%)`,
              }}
            />

            {/* Logo Gravitational Snap */}
            <motion.div
              key={`cosmic-logo-${replayNonce}`}
              initial={{ scale: 0.2, rotate: -45, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: Math.min(1.0, 0.2 + scrubProgress * 1.1),
                      rotate: Math.min(0, -45 + scrubProgress * 45),
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      scale: [0.2, 1.15, 0.98, 1.0],
                      rotate: [-45, 5, 0],
                      opacity: [0, 1, 1, 1],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.6, 0.85, 1],
                ease: [0.34, 1.56, 0.64, 1],
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center drop-shadow-2xl"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'liquid-aperture':
        return (
          <div className="relative flex items-center justify-center">
            {/* Aperture Mask Expansion Wave */}
            <motion.div
              key={`aperture-wave-${replayNonce}`}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.3 + scrubProgress * 3.5,
                      opacity: Math.max(0, 0.5 - scrubProgress * 0.5),
                    }
                  : {
                      scale: [0.3, 1.5, 3.5],
                      opacity: [0, 0.5, 0],
                    }
              }
              transition={{ duration: durationSec * 0.9, delay: durationSec * 0.1, ease: 'easeOut' }}
              className="absolute rounded-full border border-current pointer-events-none"
              style={{
                width: logoSize * 1.8,
                height: logoSize * 1.8,
                color: effectiveAccentColor,
              }}
            />

            {/* Logo Pulse into Aperture */}
            <motion.div
              key={`aperture-logo-${replayNonce}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.7 + scrubProgress * 0.3,
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      scale: [0.7, 1.08, 1.0],
                      opacity: [0, 1, 1],
                    }
              }
              transition={{ duration: durationSec, times: [0, 0.7, 1], ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'aurora-flare':
        return (
          <div className="relative flex items-center justify-center">
            {/* Luminous Core Glow */}
            <motion.div
              key={`aurora-core-${replayNonce}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.5 + scrubProgress * 1.2,
                      opacity: Math.sin(scrubProgress * Math.PI) * 0.5,
                    }
                  : {
                      scale: [0.5, 1.4, 1.8],
                      opacity: [0, 0.5, 0],
                    }
              }
              transition={{ duration: durationSec, ease: 'easeInOut' }}
              className="absolute rounded-full blur-2xl pointer-events-none"
              style={{
                width: logoSize * 1.8,
                height: logoSize * 1.8,
                backgroundColor: effectiveAccentColor,
              }}
            />

            {/* Aurora Logo Reveal */}
            <motion.div
              key={`aurora-logo-${replayNonce}`}
              initial={{ scale: 0.9, opacity: 0, filter: 'blur(6px)' }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.9 + scrubProgress * 0.1,
                      opacity: Math.min(1, scrubProgress * 2),
                      filter: `blur(${Math.max(0, 6 - scrubProgress * 10)}px)`,
                    }
                  : {
                      scale: [0.9, 1.0],
                      opacity: [0, 1],
                      filter: ['blur(6px)', 'blur(0px)'],
                    }
              }
              transition={{ duration: durationSec, ease: [0.16, 1, 0.3, 1] }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'apple-iris':
      default:
        return (
          <div className="relative flex items-center justify-center">
            {/* Subtle Minimal Aperture Glow */}
            <motion.div
              key={`apple-glow-${replayNonce}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.8 + scrubProgress * 0.4,
                      opacity: Math.min(0.3, scrubProgress * 0.3),
                    }
                  : {
                      scale: [0.8, 1.2],
                      opacity: [0, 0.3],
                    }
              }
              transition={{ duration: durationSec, ease: [0.16, 1, 0.3, 1] }}
              className="absolute rounded-full pointer-events-none blur-2xl"
              style={{
                width: logoSize * 1.6,
                height: logoSize * 1.6,
                backgroundColor: effectiveAccentColor,
              }}
            />

            {/* Apple-style Fluid Scale & Glide */}
            <motion.div
              key={`apple-logo-${replayNonce}`}
              initial={{ scale: 0.86, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.86 + scrubProgress * 0.14,
                      opacity: Math.min(1, scrubProgress * 1.8),
                    }
                  : {
                      scale: [0.86, 1.0],
                      opacity: [0, 1],
                    }
              }
              transition={{
                duration: durationSec,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                width: logoSize,
                height: logoSize,
                color: effectiveAccentColor,
              }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'netflix-ribbon':
        return (
          <div className="relative flex items-center justify-center [perspective:1000px]">
            {/* Left Ribbon Shard */}
            <motion.div
              key={`ribbon-left-${replayNonce}`}
              initial={{ rotateY: -70, x: -60, opacity: 0, scaleY: 0.3 }}
              animate={
                scrubProgress !== null
                  ? {
                      rotateY: -70 + scrubProgress * 70,
                      x: -60 + scrubProgress * 60,
                      opacity: Math.min(0.85, scrubProgress * 1.8),
                      scaleY: 0.3 + scrubProgress * 0.7,
                    }
                  : {
                      rotateY: [-70, 0],
                      x: [-60, 0],
                      opacity: [0, 0.85, 0],
                      scaleY: [0.3, 1.0],
                    }
              }
              transition={{ duration: durationSec * 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-6 h-36 rounded-full blur-[1px] pointer-events-none"
              style={{
                background: `linear-gradient(180deg, ${effectiveAccentColor}, transparent)`,
                boxShadow: `0 0 20px ${effectiveAccentColor}`,
              }}
            />

            {/* Right Ribbon Shard */}
            <motion.div
              key={`ribbon-right-${replayNonce}`}
              initial={{ rotateY: 70, x: 60, opacity: 0, scaleY: 0.3 }}
              animate={
                scrubProgress !== null
                  ? {
                      rotateY: 70 - scrubProgress * 70,
                      x: 60 - scrubProgress * 60,
                      opacity: Math.min(0.85, scrubProgress * 1.8),
                      scaleY: 0.3 + scrubProgress * 0.7,
                    }
                  : {
                      rotateY: 70,
                      x: [60, 0],
                      opacity: [0, 0.85, 0],
                      scaleY: [0.3, 1.0],
                    }
              }
              transition={{ duration: durationSec * 0.7, delay: durationSec * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute w-6 h-36 rounded-full blur-[1px] pointer-events-none"
              style={{
                background: `linear-gradient(180deg, transparent, ${effectiveAccentColor})`,
                boxShadow: `0 0 20px ${effectiveAccentColor}`,
              }}
            />

            {/* Center Logo Assembly */}
            <motion.div
              key={`ribbon-logo-${replayNonce}`}
              initial={{ scale: 0.4, opacity: 0, filter: 'brightness(2)' }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.4 + scrubProgress * 0.6,
                      opacity: Math.min(1, scrubProgress * 2.2),
                      filter: scrubProgress > 0.6 ? 'brightness(1)' : 'brightness(2)',
                    }
                  : {
                      scale: [0.4, 1.08, 1.0],
                      opacity: [0, 1, 1],
                      filter: ['brightness(2)', 'brightness(1)'],
                    }
              }
              transition={{ duration: durationSec, delay: durationSec * 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center drop-shadow-2xl"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'airbnb-breathe':
        return (
          <div className="relative flex items-center justify-center">
            {/* Soft Organic Pulse Halo */}
            <motion.div
              key={`breathe-halo-${replayNonce}`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.8 + Math.sin(scrubProgress * Math.PI * 2) * 0.25,
                      opacity: 0.25 + Math.sin(scrubProgress * Math.PI) * 0.2,
                    }
                  : {
                      scale: [0.8, 1.25, 0.95, 1.1, 1.0],
                      opacity: [0, 0.4, 0.2, 0.35, 0.15],
                    }
              }
              transition={{ duration: durationSec, ease: 'easeInOut' }}
              className="absolute rounded-full pointer-events-none blur-2xl"
              style={{
                width: logoSize * 1.8,
                height: logoSize * 1.8,
                backgroundColor: effectiveAccentColor,
              }}
            />

            {/* Breathing Logo */}
            <motion.div
              key={`breathe-logo-${replayNonce}`}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.85 + Math.sin(scrubProgress * Math.PI) * 0.25 + (scrubProgress > 0.8 ? (scrubProgress - 0.8) * 0.75 : 0),
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      scale: [0.85, 1.12, 0.96, 1.03, 1.0],
                      opacity: [0, 1, 1, 1, 1],
                    }
              }
              transition={{ duration: durationSec, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'apple-intelligence':
        return (
          <div className="relative flex items-center justify-center">
            {/* Iridescent Rainbow Perimeter Aura */}
            <motion.div
              key={`ai-halo-${replayNonce}`}
              initial={{ rotate: 0, scale: 0.7, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      rotate: scrubProgress * 240,
                      scale: 0.7 + scrubProgress * 0.45,
                      opacity: Math.min(0.7, scrubProgress * 1.5),
                    }
                  : {
                      rotate: [0, 240],
                      scale: [0.7, 1.15],
                      opacity: [0, 0.7, 0.5],
                    }
              }
              transition={{ duration: durationSec, ease: 'easeOut' }}
              className="absolute rounded-full pointer-events-none blur-xl"
              style={{
                width: logoSize * 1.7,
                height: logoSize * 1.7,
                background:
                  'conic-gradient(from 0deg, #A855F7 0deg, #38BDF8 72deg, #34D399 144deg, #F59E0B 216deg, #EC4899 288deg, #A855F7 360deg)',
              }}
            />

            {/* Apple Intelligence Logo */}
            <motion.div
              key={`ai-logo-${replayNonce}`}
              initial={{ scale: 0.82, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.82 + scrubProgress * 0.18,
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      scale: [0.82, 1.0],
                      opacity: [0, 1],
                    }
              }
              transition={{ duration: durationSec, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'spotify-waveform':
        return (
          <div className="relative flex items-center justify-center">
            {/* Dynamic Equalizer Harmonic Bars */}
            <div className="absolute inset-0 flex items-center justify-center gap-1.5 pointer-events-none">
              {[-3, -2, -1, 0, 1, 2, 3].map((pos, idx) => {
                const heightMult = [0.4, 0.75, 1.2, 1.6, 1.2, 0.75, 0.4][idx];
                return (
                  <motion.div
                    key={`bar-${idx}-${replayNonce}`}
                    initial={{ scaleY: 0.1, opacity: 0 }}
                    animate={
                      scrubProgress !== null
                        ? {
                            scaleY:
                              scrubProgress < 0.7
                                ? Math.sin((scrubProgress * 8 + idx) * Math.PI) * heightMult + 0.5
                                : Math.max(0, 1 - (scrubProgress - 0.7) * 3),
                            opacity:
                              scrubProgress < 0.75
                                ? 0.6
                                : Math.max(0, 1 - (scrubProgress - 0.75) * 4),
                          }
                        : {
                            scaleY: [0.1, heightMult, 0.2, heightMult * 1.2, 0],
                            opacity: [0, 0.8, 0.8, 0.5, 0],
                          }
                    }
                    transition={{ duration: durationSec * 0.85, ease: 'easeInOut' }}
                    className="w-1.5 h-20 rounded-full"
                    style={{ backgroundColor: effectiveAccentColor }}
                  />
                );
              })}
            </div>

            {/* Central Solid Logo Assembly */}
            <motion.div
              key={`waveform-logo-${replayNonce}`}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: scrubProgress > 0.4 ? Math.min(1.0, (scrubProgress - 0.4) * 1.8 + 0.3) : 0.3,
                      opacity: scrubProgress > 0.4 ? Math.min(1.0, (scrubProgress - 0.4) * 2.5) : 0,
                    }
                  : {
                      scale: [0.3, 1.1, 1.0],
                      opacity: [0, 0, 1, 1],
                    }
              }
              transition={{ duration: durationSec, times: [0, 0.4, 0.85, 1], ease: [0.34, 1.56, 0.64, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center drop-shadow-lg"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'raycast-superconductor':
        return (
          <div className="relative flex items-center justify-center">
            {/* 4 Diagonal Superconductor Beams */}
            {[
              { x: -140, y: -140 },
              { x: 140, y: -140 },
              { x: -140, y: 140 },
              { x: 140, y: 140 },
            ].map((beam, i) => (
              <motion.div
                key={`beam-${i}-${replayNonce}`}
                initial={{ x: beam.x, y: beam.y, opacity: 0, scale: 0.5 }}
                animate={
                  scrubProgress !== null
                    ? {
                        x: beam.x * (1 - Math.min(1, scrubProgress * 1.6)),
                        y: beam.y * (1 - Math.min(1, scrubProgress * 1.6)),
                        opacity: scrubProgress < 0.65 ? 0.9 : Math.max(0, 1 - (scrubProgress - 0.65) * 5),
                      }
                    : {
                        x: [beam.x, 0],
                        y: [beam.y, 0],
                        opacity: [0, 1, 0],
                      }
                }
                transition={{ duration: durationSec * 0.55, ease: 'easeIn' }}
                className="absolute w-2 h-2 rounded-full pointer-events-none"
                style={{
                  backgroundColor: effectiveAccentColor,
                  boxShadow: `0 0 10px 4px ${effectiveAccentColor}`,
                }}
              />
            ))}

            {/* Impact Flash & Snap Logo */}
            <motion.div
              key={`raycast-logo-${replayNonce}`}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale:
                        scrubProgress < 0.4
                          ? 0.1
                          : Math.min(1.0, 0.1 + (scrubProgress - 0.4) * 1.8),
                      opacity: scrubProgress < 0.4 ? 0 : 1,
                    }
                  : {
                      scale: [0.1, 1.25, 0.98, 1.0],
                      opacity: [0, 0, 1, 1],
                    }
              }
              transition={{ duration: durationSec, times: [0, 0.45, 0.75, 1], ease: [0.16, 1, 0.3, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center drop-shadow-2xl"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'stripe-mesh':
        return (
          <div className="relative flex items-center justify-center overflow-hidden">
            {/* Prismatic Fluid Silk Mesh Wave */}
            <motion.div
              key={`mesh-wave-${replayNonce}`}
              initial={{ x: '-120%', opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      x: `${-120 + scrubProgress * 240}%`,
                      opacity: Math.sin(scrubProgress * Math.PI) * 0.6,
                    }
                  : {
                      x: ['-120%', '120%'],
                      opacity: [0, 0.6, 0],
                    }
              }
              transition={{ duration: durationSec * 0.9, ease: 'easeInOut' }}
              className="absolute w-44 h-44 rounded-full pointer-events-none blur-3xl"
              style={{
                background: `radial-gradient(circle, ${effectiveAccentColor} 0%, #38BDF8 50%, transparent 80%)`,
              }}
            />

            {/* Logo Contour */}
            <motion.div
              key={`stripe-logo-${replayNonce}`}
              initial={{ opacity: 0, y: 15 }}
              animate={
                scrubProgress !== null
                  ? {
                      opacity: Math.min(1, scrubProgress * 2),
                      y: Math.max(0, 15 - scrubProgress * 25),
                    }
                  : {
                      opacity: [0, 1],
                      y: [15, 0],
                    }
              }
              transition={{ duration: durationSec, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center drop-shadow-xl"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'linear-orbit':
        return (
          <div className="relative flex items-center justify-center [perspective:800px]">
            {/* 3D Gyroscope Orbital Ring 1 */}
            <motion.div
              key={`orbit-1-${replayNonce}`}
              initial={{ rotateX: 65, rotateZ: 0, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      rotateX: 65 - scrubProgress * 65,
                      rotateZ: scrubProgress * 180,
                      opacity: Math.max(0, 0.6 - scrubProgress * 0.6),
                    }
                  : {
                      rotateX: [65, 0],
                      rotateZ: [0, 180],
                      opacity: [0, 0.8, 0],
                    }
              }
              transition={{ duration: durationSec * 0.8, ease: 'easeOut' }}
              className="absolute rounded-full border-2 border-dashed pointer-events-none"
              style={{
                width: logoSize * 1.5,
                height: logoSize * 1.5,
                borderColor: effectiveAccentColor,
              }}
            />

            {/* 3D Gyroscope Orbital Ring 2 */}
            <motion.div
              key={`orbit-2-${replayNonce}`}
              initial={{ rotateY: 65, rotateZ: 0, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      rotateY: 65 - scrubProgress * 65,
                      rotateZ: -scrubProgress * 180,
                      opacity: Math.max(0, 0.6 - scrubProgress * 0.6),
                    }
                  : {
                      rotateY: [65, 0],
                      rotateZ: [0, -180],
                      opacity: [0, 0.8, 0],
                    }
              }
              transition={{ duration: durationSec * 0.8, delay: durationSec * 0.1, ease: 'easeOut' }}
              className="absolute rounded-full border border-dotted pointer-events-none"
              style={{
                width: logoSize * 1.35,
                height: logoSize * 1.35,
                borderColor: effectiveAccentColor,
              }}
            />

            {/* Core Locked Logo */}
            <motion.div
              key={`linear-logo-${replayNonce}`}
              initial={{ scale: 0.6, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: 0.6 + scrubProgress * 0.4,
                      opacity: Math.min(1, scrubProgress * 1.8),
                    }
                  : {
                      scale: [0.6, 1.0],
                      opacity: [0, 1],
                    }
              }
              transition={{ duration: durationSec, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center drop-shadow-xl"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'uber-aperture':
        return (
          <div className="relative flex items-center justify-center">
            {/* Shutter Blade Aperture Iris */}
            <motion.div
              key={`aperture-iris-${replayNonce}`}
              initial={{ rotate: -90, scale: 0.2, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      rotate: -90 + scrubProgress * 90,
                      scale: 0.2 + scrubProgress * 0.8,
                      opacity: Math.min(1, scrubProgress * 2),
                    }
                  : {
                      rotate: [-90, 0],
                      scale: [0.2, 1.0],
                      opacity: [0, 1],
                    }
              }
              transition={{ duration: durationSec, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center drop-shadow-2xl"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );

      case 'matrix-decrypt':
        return (
          <div className="relative flex items-center justify-center">
            {/* Scrambled Matrix Hex Characters */}
            <motion.div
              key={`decrypt-chars-${replayNonce}`}
              initial={{ opacity: 1 }}
              animate={
                scrubProgress !== null
                  ? { opacity: Math.max(0, 1 - scrubProgress * 1.6) }
                  : { opacity: [1, 0.8, 0] }
              }
              transition={{ duration: durationSec * 0.6, ease: 'linear' }}
              className="absolute font-mono text-[10px] tracking-widest pointer-events-none"
              style={{ color: effectiveAccentColor }}
            >
              0x8F9A // DECRYPTING_CONT
            </motion.div>

            {/* Sharp Resolved Logo */}
            <motion.div
              key={`matrix-logo-${replayNonce}`}
              initial={{ opacity: 0, filter: 'blur(8px)' }}
              animate={
                scrubProgress !== null
                  ? {
                      opacity: Math.min(1, scrubProgress * 2),
                      filter: scrubProgress > 0.5 ? 'blur(0px)' : 'blur(4px)',
                    }
                  : {
                      opacity: [0, 0.4, 1],
                      filter: ['blur(8px)', 'blur(0px)'],
                    }
              }
              transition={{ duration: durationSec, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: logoSize, height: logoSize, color: effectiveAccentColor }}
              className="relative z-10 flex items-center justify-center drop-shadow-[0_0_15px_currentColor]"
              dangerouslySetInnerHTML={{ __html: adaptiveSvg }}
            />
          </div>
        );
    }
  };

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: config.backgroundColor }}
    >
      {/* ================= 1. Screen-Wide Backdrop FX Layer ================= */}
      {config.backdropEffect === 'aurora' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            key={`aurora-bg-${replayNonce}`}
            animate={
              scrubProgress !== null
                ? { rotate: scrubProgress * 60, scale: 1 + scrubProgress * 0.1 }
                : { rotate: [0, 45, 90, 135, 180], scale: [1, 1.1, 1] }
            }
            transition={{ duration: durationSec * 3, ease: 'linear' }}
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] blur-3xl pointer-events-none"
            style={{
              opacity: isBgLight ? 0.14 : 0.22,
              mixBlendMode: isBgLight ? 'multiply' : 'screen',
              background: `radial-gradient(circle at 35% 35%, ${effectiveAccentColor} 0%, transparent 45%), radial-gradient(circle at 65% 65%, ${isBgLight ? '#0284C7' : '#38BDF8'} 0%, transparent 50%)`,
            }}
          />
        </div>
      )}

      {config.backdropEffect === 'particles' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLE_POSITIONS.map((p, i) => (
            <motion.div
              key={`part-${i}-${replayNonce}`}
              initial={{ x: p.startX, y: p.startY, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      x: p.startX * (1 - Math.min(1, scrubProgress * 1.4)),
                      y: p.startY * (1 - Math.min(1, scrubProgress * 1.4)),
                      opacity: scrubProgress < 0.75 ? 0.7 : Math.max(0, 1 - (scrubProgress - 0.75) * 4),
                    }
                  : {
                      x: [p.startX, 0],
                      y: [p.startY, 0],
                      opacity: [0, 0.8, 0],
                    }
              }
              transition={{ duration: durationSec * 0.75, ease: 'easeIn' }}
              className="absolute left-1/2 top-1/2 rounded-full pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                backgroundColor: effectiveAccentColor,
                boxShadow: `0 0 6px ${effectiveAccentColor}`,
              }}
            />
          ))}
        </div>
      )}

      {config.backdropEffect === 'shockwave' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[0, 0.14, 0.28].map((delay, i) => (
            <motion.div
              key={`shockwave-ring-${i}-${replayNonce}`}
              initial={{ scale: 0.1, opacity: 0 }}
              animate={
                scrubProgress !== null
                  ? {
                      scale: Math.max(0.1, (scrubProgress - delay) * 4.5),
                      opacity: Math.max(0, 0.5 - (scrubProgress - delay) * 0.7),
                    }
                  : {
                      scale: [0.1, 4.0],
                      opacity: [0, 0.5, 0],
                    }
              }
              transition={{ duration: durationSec * 0.85, delay, ease: 'easeOut' }}
              className="absolute rounded-full border border-current pointer-events-none"
              style={{
                width: logoSize * 1.5,
                height: logoSize * 1.5,
                color: effectiveAccentColor,
              }}
            />
          ))}
        </div>
      )}

      {config.backdropEffect === 'lens-flare' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <motion.div
            key={`lens-flare-${replayNonce}`}
            initial={{ x: '-150%', opacity: 0 }}
            animate={
              scrubProgress !== null
                ? {
                    x: `${-150 + scrubProgress * 300}%`,
                    opacity: Math.sin(scrubProgress * Math.PI) * 0.8,
                  }
                : {
                    x: ['-150%', '150%'],
                    opacity: [0, 0.85, 0],
                  }
            }
            transition={{ duration: durationSec * 0.8, delay: durationSec * 0.15, ease: 'easeInOut' }}
            className="w-[250%] h-10 pointer-events-none"
            style={{
              background: isBgLight
                ? `linear-gradient(90deg, transparent 0%, ${effectiveAccentColor} 46%, #09090B 50%, ${effectiveAccentColor} 54%, transparent 100%)`
                : `linear-gradient(90deg, transparent 0%, ${effectiveAccentColor} 46%, #FFFFFF 50%, ${effectiveAccentColor} 54%, transparent 100%)`,
              filter: 'blur(3px)',
              mixBlendMode: isBgLight ? 'multiply' : 'screen',
            }}
          />
        </div>
      )}

      {config.backdropEffect === 'cyber-grid' && (
        <div className={`absolute inset-0 pointer-events-none overflow-hidden ${isBgLight ? 'opacity-10' : 'opacity-15'}`}>
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(to right, ${effectiveAccentColor} 1px, transparent 1px), linear-gradient(to bottom, ${effectiveAccentColor} 1px, transparent 1px)`,
              backgroundSize: '24px 24px',
            }}
          />
          {/* Laser Scanning Bar */}
          <motion.div
            key={`laser-scan-${replayNonce}`}
            initial={{ y: 0 }}
            animate={scrubProgress !== null ? { y: scrubProgress * 660 } : { y: [0, 660] }}
            transition={{ duration: durationSec, ease: 'linear' }}
            className="absolute inset-x-0 h-[1.5px]"
            style={{
              background: `linear-gradient(90deg, transparent, ${effectiveAccentColor}, transparent)`,
              boxShadow: `0 0 8px ${effectiveAccentColor}`,
            }}
          />
        </div>
      )}

      {/* ================= 2. Native Splash Logo Visuals ================= */}
      <motion.div
        animate={
          animationFinished && config.showHomeScreenHandoff
            ? config.exitTransition === 'zoom-aperture'
              ? { scale: 35, opacity: 0 }
              : config.exitTransition === 'curtain-up'
              ? { y: -600, opacity: 0 }
              : { opacity: 0 }
            : { scale: 1, y: 0, opacity: 1 }
        }
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        {renderTemplateVisuals()}
      </motion.div>

      {/* ================= 3. Kinetic Typography Layer ================= */}
      {config.appName && config.titleAnimation !== 'none' && (
        <div className="absolute bottom-16 inset-x-0 flex justify-center z-10 px-4" style={{ color: textColor }}>
          {config.titleAnimation === 'letter-stagger' ? (
            /* Kinetic Stagger Letter-by-Letter */
            <div className="flex items-center justify-center space-x-[2px]">
              {config.appName.split('').map((char, idx) => (
                <motion.span
                  key={`char-${idx}-${replayNonce}`}
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    scrubProgress !== null
                      ? {
                          opacity: Math.max(0, (scrubProgress - 0.3 - idx * 0.03) * 3),
                          y: Math.max(0, 12 - (scrubProgress - 0.3 - idx * 0.03) * 25),
                        }
                      : {
                          opacity: [0, 1],
                          y: [12, 0],
                        }
                  }
                  transition={{
                    duration: 0.35,
                    delay: durationSec * 0.35 + idx * 0.04,
                    ease: 'easeOut',
                  }}
                  className="text-xs uppercase font-semibold tracking-wider opacity-85"
                >
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </div>
          ) : config.titleAnimation === 'mask-slide' ? (
            /* Overflow Mask Slide */
            <div className="overflow-hidden py-1">
              <motion.div
                key={`mask-slide-${replayNonce}`}
                initial={{ y: '100%', opacity: 0 }}
                animate={
                  scrubProgress !== null
                    ? {
                        y: `${Math.max(0, 100 - (scrubProgress - 0.3) * 200)}%`,
                        opacity: Math.max(0, (scrubProgress - 0.3) * 2.5),
                      }
                    : {
                        y: ['100%', '0%'],
                        opacity: [0, 1],
                      }
                }
                transition={{ duration: durationSec * 0.5, delay: durationSec * 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="text-xs tracking-[0.25em] uppercase font-semibold opacity-85">
                  {config.appName}
                </span>
              </motion.div>
            </div>
          ) : (
            /* Tracking Expansion */
            <motion.div
              key={`tracking-${replayNonce}`}
              initial={{ opacity: 0, letterSpacing: '0.05em' }}
              animate={
                scrubProgress !== null
                  ? {
                      opacity: Math.max(0, (scrubProgress - 0.3) * 2),
                      letterSpacing: `${0.05 + Math.min(0.25, (scrubProgress - 0.3) * 0.35)}em`,
                    }
                  : {
                      opacity: [0, 1],
                      letterSpacing: ['0.05em', '0.25em'],
                    }
              }
              transition={{ duration: durationSec * 0.6, delay: durationSec * 0.25, ease: 'easeOut' }}
            >
              <span className="text-xs uppercase font-semibold opacity-85">
                {config.appName}
              </span>
            </motion.div>
          )}
        </div>
      )}

      {/* ================= 4. App Screen Handoff ================= */}
      <AnimatePresence>
        {config.showHomeScreenHandoff && animationFinished && scrubProgress === null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="absolute inset-0 z-30 flex flex-col p-6 backdrop-blur-md"
            style={{
              backgroundColor:
                config.themeMode === 'dark' ? 'rgba(11, 15, 25, 0.96)' : 'rgba(255, 255, 255, 0.96)',
            }}
          >
            {/* Mock App Header */}
            <div className="flex items-center justify-between mb-8 mt-4">
              <div className="w-8 h-8 rounded-full bg-slate-500/20" />
              <div className="h-4 w-28 rounded-full bg-slate-500/30" />
              <div className="w-8 h-8 rounded-full bg-slate-500/20" />
            </div>

            {/* Mock App Cards */}
            <div className="space-y-4 flex-1">
              <div className="h-32 rounded-2xl bg-gradient-to-tr from-slate-500/20 to-slate-500/5 p-4 flex flex-col justify-end">
                <div className="h-4 w-32 rounded-full bg-slate-400/40 mb-2" />
                <div className="h-3 w-48 rounded-full bg-slate-400/20" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="h-28 rounded-xl bg-slate-500/10 p-3 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/40" />
                  <div className="h-3 w-20 rounded-full bg-slate-400/30" />
                </div>
                <div className="h-28 rounded-xl bg-slate-500/10 p-3 flex flex-col justify-between">
                  <div className="w-6 h-6 rounded-lg bg-pink-500/40" />
                  <div className="h-3 w-20 rounded-full bg-slate-400/30" />
                </div>
              </div>

              <div className="h-20 rounded-xl bg-slate-500/10" />
            </div>

            {/* Status indicator badge */}
            <div className="py-1.5 px-3 rounded-md bg-zinc-800/80 border border-white/[0.06] text-center">
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider">
                Handoff Complete
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
