import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import os from 'os';
import crypto from 'crypto';

const execPromise = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, targetColor = '#FFFFFF', similarity = 0.15, blend = 0.05 } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'Missing image payload' }, { status: 400 });
    }

    // 1. If it's a vector SVG (without embedded raster image)
    const hasEmbeddedRaster = image.includes('<image ') || image.includes('xlink:href=');
    const isSvg = image.trim().startsWith('<svg') || image.includes('data:image/svg+xml');

    if (isSvg && !hasEmbeddedRaster) {
      // Clean SVG directly by stripping background rects and background styles
      let cleanedSvg = image;
      if (image.startsWith('data:image/svg+xml')) {
        const commaIdx = image.indexOf(',');
        cleanedSvg = decodeURIComponent(image.slice(commaIdx + 1));
      }

      // Remove background rects (e.g., width="100%" or matching whole canvas)
      cleanedSvg = cleanedSvg.replace(
        /<rect[^>]+(?:width=["'](?:100%|100|800|512)["'][^>]*height=["'](?:100%|100|800|512)["']|fill=["'](?:#fff|#ffffff|#000|#000000|white|black)["'])[^>]*\/?>/gi,
        ''
      );

      // Remove style="background:..." or style="background-color:..." on svg tag
      cleanedSvg = cleanedSvg.replace(/style=["'][^"']*background[^"']*["']/gi, '');

      return NextResponse.json({
        success: true,
        type: 'svg',
        resultSvg: cleanedSvg,
        message: 'SVG background rects stripped successfully',
      });
    }

    // 2. Raster Image Processing via Local FFmpeg
    let base64Data = image;
    let isWrappedSvg = false;

    // Extract base64 from data URL or embedded SVG image
    if (image.includes('data:image/')) {
      const match = image.match(/data:image\/[a-zA-Z+]+;base64,([A-Za-z0-9+/=]+)/);
      if (match) {
        base64Data = match[1];
        isWrappedSvg = image.includes('<svg');
      }
    }

    const uniqueId = crypto.randomBytes(8).toString('hex');
    const tempDir = os.tmpdir();
    const inputPath = path.join(tempDir, `ns_in_${uniqueId}.png`);
    const outputPath = path.join(tempDir, `ns_out_${uniqueId}.png`);

    // Write input raster buffer
    const buffer = Buffer.from(base64Data, 'base64');
    fs.writeFileSync(inputPath, buffer);

    // Clean hex target color (e.g. #FFFFFF -> 0xffffff)
    const cleanHex = targetColor.replace('#', '').toLowerCase();
    const ffmpegHex = `0x${cleanHex.length === 3 ? cleanHex.split('').map((c: string) => c + c).join('') : cleanHex}`;

    // FFmpeg colorkey execution
    const ffmpegCmd = `ffmpeg -y -i "${inputPath}" -vf "colorkey=color=${ffmpegHex}:similarity=${similarity}:blend=${blend},format=rgba" "${outputPath}"`;

    try {
      await execPromise(ffmpegCmd);

      if (!fs.existsSync(outputPath)) {
        throw new Error('FFmpeg failed to generate transparent output');
      }

      const outBuffer = fs.readFileSync(outputPath);
      const outBase64 = outBuffer.toString('base64');
      const transparentDataUrl = `data:image/png;base64,${outBase64}`;

      // Re-wrap in SVG if input was an SVG wrapper or user wants SVG
      const finalSvg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <image href="${transparentDataUrl}" x="5" y="5" width="90" height="90" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

      return NextResponse.json({
        success: true,
        type: 'raster',
        transparentDataUrl,
        resultSvg: finalSvg,
        message: `Background removed using local FFmpeg (color: ${targetColor})`,
      });
    } finally {
      // Clean up temp files
      try {
        if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
        if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
      } catch {
        // ignore cleanup error
      }
    }
  } catch (err: any) {
    console.error('Remove background error:', err);
    return NextResponse.json(
      { error: err.message || 'Background removal failed' },
      { status: 500 }
    );
  }
}
