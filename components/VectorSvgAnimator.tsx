'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface VectorSvgAnimatorProps {
  svgString: string;
  accentColor: string;
  durationSec: number;
  scrubProgress: number | null;
  replayNonce: number;
  templateId: string;
  className?: string;
  isBgLight: boolean;
}

interface ParsedVector {
  hasPaths: boolean;
  viewBox: string;
  paths: Array<{ d: string; fill?: string; stroke?: string }>;
  isRasterImage: boolean;
  imageHref?: string;
}

export function parseSvgVectors(svgString: string): ParsedVector {
  if (!svgString) {
    return {
      hasPaths: false,
      viewBox: '0 0 100 100',
      paths: [],
      isRasterImage: false,
    };
  }

  // Check for embedded raster image
  const imageMatch = svgString.match(/<image[^>]+(?:href|xlink:href)=["']([^"']+)["']/i);
  if (imageMatch) {
    return {
      hasPaths: false,
      viewBox: '0 0 100 100',
      paths: [],
      isRasterImage: true,
      imageHref: imageMatch[1],
    };
  }

  // Extract viewBox
  const vbMatch = svgString.match(/viewBox=["']([^"']+)["']/i);
  const viewBox = vbMatch ? vbMatch[1] : '0 0 100 100';

  // Extract all <path> tags
  const paths: Array<{ d: string; fill?: string; stroke?: string }> = [];
  const pathRegex = /<path\b([^>]*)\/?>/gi;
  let match: RegExpExecArray | null;

  while ((match = pathRegex.exec(svgString)) !== null) {
    const attrString = match[1];
    const dMatch = attrString.match(/d=["']([^"']+)["']/i);
    if (dMatch && dMatch[1]) {
      const fillMatch = attrString.match(/fill=["']([^"']+)["']/i);
      const strokeMatch = attrString.match(/stroke=["']([^"']+)["']/i);
      paths.push({
        d: dMatch[1],
        fill: fillMatch ? fillMatch[1] : undefined,
        stroke: strokeMatch ? strokeMatch[1] : undefined,
      });
    }
  }

  // Extract <polygon> or <polyline> as paths
  const polyRegex = /<(?:polygon|polyline)\b[^>]*points=["']([^"']+)["'][^>]*\/?>/gi;
  while ((match = polyRegex.exec(svgString)) !== null) {
    const pts = match[1].trim().split(/[\s,]+/);
    if (pts.length >= 4) {
      let d = `M${pts[0]},${pts[1]}`;
      for (let i = 2; i < pts.length; i += 2) {
        d += ` L${pts[i]},${pts[i + 1]}`;
      }
      d += ' Z';
      paths.push({ d });
    }
  }

  return {
    hasPaths: paths.length > 0,
    viewBox,
    paths,
    isRasterImage: false,
  };
}

export function VectorSvgAnimator({
  svgString,
  accentColor,
  durationSec,
  scrubProgress,
  replayNonce,
  templateId,
  className = '',
  isBgLight,
}: VectorSvgAnimatorProps) {
  const parsed = useMemo(() => parseSvgVectors(svgString), [svgString]);

  // If raster image (e.g. user uploaded PNG/JPG)
  if (parsed.isRasterImage && parsed.imageHref) {
    return (
      <img
        src={parsed.imageHref}
        alt="Logo"
        className={`w-full h-full object-contain pointer-events-none ${className}`}
      />
    );
  }

  // If no parseable vector paths, render raw SVG with adaptive color
  if (!parsed.hasPaths) {
    return (
      <div
        className={`w-full h-full flex items-center justify-center ${className}`}
        dangerouslySetInnerHTML={{ __html: svgString }}
      />
    );
  }

  // SPECIFIC VECTOR ENGINE: path-trace (Authentic Vector Stroke Draw & Ink Fill)
  if (templateId === 'path-trace') {
    return (
      <svg
        viewBox={parsed.viewBox}
        className={`w-full h-full overflow-visible pointer-events-none ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {parsed.paths.map((p, idx) => {
          const pathFill = p.fill && p.fill !== 'none' ? accentColor : accentColor;
          return (
            <motion.path
              key={`vector-trace-${idx}-${replayNonce}`}
              d={p.d}
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={pathFill}
              initial={{ pathLength: 0, fillOpacity: 0, strokeOpacity: 1 }}
              animate={
                scrubProgress !== null
                  ? {
                      pathLength: Math.min(1, scrubProgress / 0.65),
                      fillOpacity: scrubProgress > 0.6 ? (scrubProgress - 0.6) / 0.4 : 0,
                      strokeOpacity: scrubProgress > 0.85 ? 0.3 : 1,
                    }
                  : {
                      pathLength: [0, 1, 1],
                      fillOpacity: [0, 0, 1],
                      strokeOpacity: [1, 1, 0.4],
                    }
              }
              transition={{
                duration: durationSec,
                times: [0, 0.65, 1],
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </svg>
    );
  }

  // SPECIFIC VECTOR ENGINE: spring-bloom (Overshoot scale with vector stroke blooming)
  if (templateId === 'spring-bloom') {
    return (
      <svg
        viewBox={parsed.viewBox}
        className={`w-full h-full overflow-visible pointer-events-none ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {parsed.paths.map((p, idx) => (
          <motion.path
            key={`vector-bloom-${idx}-${replayNonce}`}
            d={p.d}
            fill={accentColor}
            stroke={accentColor}
            strokeWidth="0.5"
            initial={{ scale: 0.35, opacity: 0 }}
            animate={
              scrubProgress !== null
                ? {
                    scale: 0.35 + scrubProgress * 0.65,
                    opacity: Math.min(1, scrubProgress * 1.5),
                  }
                : {
                    scale: [0.35, 1.12, 0.98, 1],
                    opacity: [0, 1, 1, 1],
                  }
            }
            transition={{
              duration: durationSec,
              times: [0, 0.55, 0.8, 1],
              ease: [0.34, 1.56, 0.64, 1], // Crisp spring overshoot
            }}
            style={{ transformOrigin: 'center' }}
          />
        ))}
      </svg>
    );
  }

  // SPECIFIC VECTOR ENGINE: apple-iris (Smooth vector fluid aperture expansion)
  if (templateId === 'apple-iris') {
    return (
      <svg
        viewBox={parsed.viewBox}
        className={`w-full h-full overflow-visible pointer-events-none ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {parsed.paths.map((p, idx) => (
          <motion.path
            key={`vector-iris-${idx}-${replayNonce}`}
            d={p.d}
            fill={accentColor}
            initial={{ scale: 0.88, opacity: 0 }}
            animate={
              scrubProgress !== null
                ? {
                    scale: 0.88 + scrubProgress * 0.12,
                    opacity: Math.min(1, scrubProgress * 1.8),
                  }
                : {
                    scale: [0.88, 1.0],
                    opacity: [0, 1],
                  }
            }
            transition={{
              duration: durationSec,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: 'center' }}
          />
        ))}
      </svg>
    );
  }

  // DEFAULT VECTOR RENDERER (Crisp vector path rendering with adaptive accent fill)
  return (
    <svg
      viewBox={parsed.viewBox}
      className={`w-full h-full overflow-visible pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {parsed.paths.map((p, idx) => (
        <path
          key={`vector-default-${idx}`}
          d={p.d}
          fill={accentColor}
          stroke={accentColor}
          strokeWidth="0.5"
        />
      ))}
    </svg>
  );
}
