import React from 'react';

// Canvas-based background remover: flood-fill from edges, then slight erode + feather, then auto-crop
// Session cache for processed images (memory + localStorage)
const chromaCache = typeof window !== 'undefined' ? (window.__chromaCache = window.__chromaCache || new Map()) : new Map();

export default function ChromaKeyImage({
  src,
  alt = '',
  className = '',
  style,
  threshold = 245,
  edgeErode = 2,
  feather = 1,
  autoCropPadding = 0,
  sampleEdges = true,
  tolerance = 26,
  // Fallback guard: if too few opaque pixels remain after processing, show original image
  minOpaqueRatio = 0.02,
}) {
  const cacheKey = React.useMemo(() => `ck:v1:${src}`, [src]);
  const initialFromCache = React.useMemo(() => {
    try {
      const mem = chromaCache.get(cacheKey);
      if (mem) return mem;
      if (typeof window !== 'undefined') {
        const stored = window.localStorage.getItem(cacheKey);
        if (stored) return stored;
      }
    } catch (_) {}
    return null;
  }, [cacheKey]);
  const [processedSrc, setProcessedSrc] = React.useState(initialFromCache);

  React.useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.loading = 'eager';
    img.src = src;
    img.onload = () => {
      if (cancelled) return;
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        const w = img.naturalWidth;
        const h = img.naturalHeight;
        if (!w || !h) return;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const { data } = imageData;
        const visited = new Uint8Array(w * h);
        const idx = (x, y) => (y * w + x) * 4;

        // Sample background color from edges (handles beige/cream backgrounds)
        let bgR = 255, bgG = 255, bgB = 255, bgTol = tolerance;
        if (sampleEdges) {
          const samples = [];
          const step = Math.max(1, Math.floor(Math.min(w, h) / 80));
          const pushSample = (x, y) => {
            const o = idx(x, y);
            const a = data[o + 3];
            if (a > 200) samples.push([data[o], data[o + 1], data[o + 2]]);
          };
          for (let x = 0; x < w; x += step) {
            pushSample(x, 0);
            pushSample(x, h - 1);
          }
          for (let y = 0; y < h; y += step) {
            pushSample(0, y);
            pushSample(w - 1, y);
          }
          if (samples.length > 0) {
            let rSum = 0, gSum = 0, bSum = 0;
            for (const [r, g, b] of samples) { rSum += r; gSum += g; bSum += b; }
            bgR = Math.round(rSum / samples.length);
            bgG = Math.round(gSum / samples.length);
            bgB = Math.round(bSum / samples.length);
            let spread = 0;
            for (const [r, g, b] of samples) {
              const dr = r - bgR, dg = g - bgG, db = b - bgB;
              spread += Math.sqrt(dr * dr + dg * dg + db * db);
            }
            spread = spread / samples.length;
            bgTol = Math.max(14, Math.min(42, Math.round(tolerance + spread * 0.6)));
          }
        }

        const isNearBackground = (r, g, b) => {
          if (sampleEdges) {
            const dr = r - bgR, dg = g - bgG, db = b - bgB;
            const dist = Math.sqrt(dr * dr + dg * dg + db * db);
            return dist <= bgTol;
          }
          return (r >= threshold && g >= threshold && b >= threshold);
        };

        const queue = [];
        for (let x = 0; x < w; x++) { queue.push([x, 0]); queue.push([x, h - 1]); }
        for (let y = 0; y < h; y++) { queue.push([0, y]); queue.push([w - 1, y]); }

        while (queue.length) {
          const [x, y] = queue.pop();
          if (x < 0 || y < 0 || x >= w || y >= h) continue;
          const p = y * w + x;
          if (visited[p]) continue;
          visited[p] = 1;
          const o = p * 4;
          const r = data[o], g = data[o + 1], b = data[o + 2], a = data[o + 3];
          if (a === 0) {
            queue.push([x + 1, y]);
            queue.push([x - 1, y]);
            queue.push([x, y + 1]);
            queue.push([x, y - 1]);
            continue;
          }
          if (isNearBackground(r, g, b)) {
            data[o + 3] = 0;
            queue.push([x + 1, y]);
            queue.push([x - 1, y]);
            queue.push([x, y + 1]);
            queue.push([x, y - 1]);
          }
        }

        // Erode halo
        if (edgeErode > 0) {
          for (let iter = 0; iter < edgeErode; iter++) {
            const copy = new Uint8ClampedArray(data);
            for (let y = 0; y < h; y++) {
              for (let x = 0; x < w; x++) {
                const o = idx(x, y);
                if (copy[o + 3] !== 0) continue;
                for (let dy = -1; dy <= 1; dy++) {
                  for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const nx = x + dx, ny = y + dy;
                    if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
                    const no = idx(nx, ny);
                    data[no + 3] = Math.min(data[no + 3], 20);
                  }
                }
              }
            }
          }
        }

        // Feather
        if (feather > 0) {
          for (let iter = 0; iter < feather; iter++) {
            const copy = new Uint8ClampedArray(data);
            for (let y = 1; y < h - 1; y++) {
              for (let x = 1; x < w - 1; x++) {
                const o = idx(x, y);
                const a = copy[o + 3];
                const neighbors = [
                  copy[idx(x - 1, y) + 3], copy[idx(x + 1, y) + 3],
                  copy[idx(x, y - 1) + 3], copy[idx(x, y + 1) + 3]
                ];
                const minN = Math.min(...neighbors);
                if (a > 0 && minN === 0) {
                  data[o + 3] = Math.max(0, Math.min(255, Math.floor(a * 0.8)));
                }
              }
            }
          }
        }

        // Write back and crop
        ctx.putImageData(imageData, 0, 0);
        let minX = w, minY = h, maxX = -1, maxY = -1;
        let opaqueCount = 0;
        const totalPixels = w * h;
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const a = data[idx(x, y) + 3];
            if (a > 25) opaqueCount++;
            if (a !== 0) {
              if (x < minX) minX = x;
              if (y < minY) minY = y;
              if (x > maxX) maxX = x;
              if (y > maxY) maxY = y;
            }
          }
        }

        // If the remaining opaque area is too small, fall back to original image (prevents full disappearance)
        const opaqueRatio = opaqueCount / totalPixels;
        if (opaqueRatio < minOpaqueRatio) {
          if (!cancelled) {
            try { chromaCache.set(cacheKey, src); if (typeof window !== 'undefined') window.localStorage.setItem(cacheKey, src); } catch (_) {}
            setProcessedSrc(src);
          }
          return;
        }

        let url;
        if (maxX >= minX && maxY >= minY) {
          const pad = Math.max(0, autoCropPadding | 0);
          const cropX = Math.max(0, minX - pad);
          const cropY = Math.max(0, minY - pad);
          const cropW = Math.min(w - cropX, (maxX - minX + 1) + pad * 2);
          const cropH = Math.min(h - cropY, (maxY - minY + 1) + pad * 2);
          const c2 = document.createElement('canvas');
          c2.width = cropW; c2.height = cropH;
          const ctx2 = c2.getContext('2d');
          ctx2.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
          url = c2.toDataURL('image/png');
        } else {
          url = canvas.toDataURL('image/png');
        }
        if (!cancelled) {
          try { chromaCache.set(cacheKey, url); if (typeof window !== 'undefined') window.localStorage.setItem(cacheKey, url); } catch (_) {}
          setProcessedSrc(url);
        }
      } catch {
        if (!cancelled) setProcessedSrc(src);
      }
    };
    img.onerror = () => { if (!cancelled) setProcessedSrc(src); };
    return () => { cancelled = true; };
  }, [src, threshold, edgeErode, feather, autoCropPadding, sampleEdges, tolerance, minOpaqueRatio]);

  if (!processedSrc) {
    // Reserve layout space but keep invisible until processed image is ready
    return <div className={className} style={{ ...style, visibility: 'hidden' }} aria-hidden="true" />;
  }
  return (
    <img src={processedSrc} alt={alt} className={className} style={style} loading="eager" decoding="async" />
  );
}


