/**
 * Background removal utility using local FFmpeg API endpoint with HTML5 Canvas fallback.
 */

export interface RemoveBgOptions {
  targetColor?: string; // hex color e.g. '#FFFFFF' or '#000000'
  similarity?: number;
  blend?: number;
}

export async function removeBackground(
  imageSource: string,
  options: RemoveBgOptions = {}
): Promise<{ success: boolean; resultSvg: string; message: string }> {
  try {
    // 1. Try local server-side FFmpeg endpoint
    const response = await fetch('/api/remove-bg', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageSource,
        targetColor: options.targetColor || '#FFFFFF',
        similarity: options.similarity ?? 0.15,
        blend: options.blend ?? 0.05,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.resultSvg) {
        return {
          success: true,
          resultSvg: data.resultSvg,
          message: data.message || 'Background removed via local FFmpeg',
        };
      }
    }
  } catch (err) {
    console.warn('Local FFmpeg API route unavailable, using client-side canvas fallback:', err);
  }

  // 2. Client-side Canvas fallback (flood-fill / color-key)
  return removeBackgroundClientCanvas(imageSource, options.targetColor || '#FFFFFF');
}

export function removeBackgroundClientCanvas(
  imageSource: string,
  targetHex: string
): Promise<{ success: boolean; resultSvg: string; message: string }> {
  return new Promise((resolve) => {
    // If it's an SVG without raster image, strip background rects directly
    if (imageSource.trim().startsWith('<svg') && !imageSource.includes('<image')) {
      let cleaned = imageSource.replace(
        /<rect[^>]+(?:width=["'](?:100%|100|800|512)["'][^>]*height=["'](?:100%|100|800|512)["']|fill=["'](?:#fff|#ffffff|#000|#000000|white|black)["'])[^>]*\/?>/gi,
        ''
      );
      cleaned = cleaned.replace(/style=["'][^"']*background[^"']*["']/gi, '');
      return resolve({
        success: true,
        resultSvg: cleaned,
        message: 'SVG background rects stripped',
      });
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Extract base64 src if wrapped in SVG
    let src = imageSource;
    if (imageSource.includes('<image')) {
      const match = imageSource.match(/href="([^"]+)"/);
      if (match) src = match[1];
    }

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width || 300;
      canvas.height = img.naturalHeight || img.height || 300;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return resolve({ success: false, resultSvg: imageSource, message: 'Canvas 2D unavailable' });
      }

      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Target color to make transparent
      const cleanHex = targetHex.replace('#', '');
      const tr = parseInt(cleanHex.substring(0, 2), 16) || 255;
      const tg = parseInt(cleanHex.substring(2, 4), 16) || 255;
      const tb = parseInt(cleanHex.substring(4, 6), 16) || 255;
      const tolerance = 45; // Euclidean distance tolerance

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const dist = Math.sqrt((r - tr) ** 2 + (g - tg) ** 2 + (b - tb) ** 2);
        if (dist < tolerance) {
          data[i + 3] = 0; // Transparent
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const transparentDataUrl = canvas.toDataURL('image/png');
      const finalSvg = `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <image href="${transparentDataUrl}" x="5" y="5" width="90" height="90" preserveAspectRatio="xMidYMid meet"/>
</svg>`;

      resolve({
        success: true,
        resultSvg: finalSvg,
        message: 'Background removed via client canvas fallback',
      });
    };

    img.onerror = () => {
      resolve({ success: false, resultSvg: imageSource, message: 'Failed to decode image' });
    };

    img.src = src;
  });
}
