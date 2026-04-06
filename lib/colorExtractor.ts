"use client"
// lib/colorExtractor.ts
//
// Extracts the dominant brand colors from a user-uploaded image.
// This runs entirely in the browser using the native Canvas API —
// no external library or API call is needed.
//
// WHY CANVAS API instead of an external service?
// The images the user uploads are base64 data URLs (encoded in memory,
// never sent to a server at this point). An external service would require
// uploading the image, handling CORS, network latency, and API keys.
// The Canvas API is built into every modern browser, works offline,
// and returns results instantly with zero dependencies.

/**
 * Extracts the top 1–2 dominant colors from a base64 image data URL.
 *
 * Returns a Promise resolving to an array of hex strings (e.g. ["#3a1c71", "#d76d77"]).
 * Returns [] if the input is empty or if anything fails — the caller always gets
 * a safe value and can fall back to the vibe theme palette.
 *
 * @param base64DataUrl - A data URL string like "data:image/jpeg;base64,..."
 */
export async function extractDominantColors(base64DataUrl: string): Promise<string[]> {
  // Guard: if no image was uploaded, return early with an empty array.
  if (!base64DataUrl) return [];

  return new Promise((resolve) => {
    try {
      // Create an Image object — this is the browser's built-in image loader.
      // We won't add it to the DOM; we only need it to decode the pixel data.
      const img = new Image();

      // When the image has fully loaded, run the color extraction logic.
      img.onload = () => {
        try {
          // Create an off-screen canvas — a "virtual" drawing surface.
          // Nothing rendered here appears on screen.
          const canvas = document.createElement('canvas');

          // Downsample to 50×50 pixels. We don't need full resolution —
          // dominant colors are visible even at tiny sizes, and a small
          // canvas is much faster to process (50×50 = 2,500 pixels vs.
          // potentially millions in the original photo).
          canvas.width = 50;
          canvas.height = 50;

          // Get the 2D drawing context — this is how you draw on a canvas.
          const ctx = canvas.getContext('2d');
          if (!ctx) { resolve([]); return; }

          // Draw the image onto the canvas, scaled down to 50×50.
          ctx.drawImage(img, 0, 0, 50, 50);

          // getImageData() returns a flat array of pixel data in RGBA format.
          // Each pixel occupies 4 consecutive array slots: [R, G, B, A, R, G, B, A, ...]
          // R = red (0–255), G = green (0–255), B = blue (0–255), A = alpha / opacity.
          // For a 50×50 image, this array has 50 × 50 × 4 = 10,000 elements.
          const { data } = ctx.getImageData(0, 0, 50, 50);

          // ── Bucket quantization ──────────────────────────────────────────
          // We group similar colors into "buckets" to avoid treating every
          // slightly different shade as a new color. Each color channel (R, G, B)
          // is divided into buckets of size 32. This gives us 8 buckets per channel
          // (0–31, 32–63, ... 224–255) and 8³ = 512 possible color buckets total.
          //
          // A Map is used like a Python dict: { bucketKey: count }
          const colorCounts = new Map<string, number>();

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            // Alpha channel is data[i+3] — we ignore it

            // WHY FILTER NEAR-WHITE AND NEAR-BLACK?
            // Most photos have white highlights and dark shadows that are nearly
            // always the "dominant" color if counted. But these are rarely useful
            // as brand colors — they just reflect lighting conditions.
            // We skip pixels where all three channels are very bright (near-white)
            // or very dark (near-black).
            if (r > 230 && g > 230 && b > 230) continue; // near-white — skip
            if (r < 25  && g < 25  && b < 25)  continue; // near-black — skip

            // Snap each channel to the nearest bucket boundary.
            // Math.floor(x / 32) * 32 turns e.g. 45 → 32, 100 → 96, etc.
            const bucketR = Math.floor(r / 32) * 32;
            const bucketG = Math.floor(g / 32) * 32;
            const bucketB = Math.floor(b / 32) * 32;

            // Build a string key for this color bucket, e.g. "96-64-32"
            const key = `${bucketR}-${bucketG}-${bucketB}`;

            // Increment the count for this bucket (or start at 0 if new)
            colorCounts.set(key, (colorCounts.get(key) ?? 0) + 1);
          }

          // Sort buckets by frequency (most common first)
          const sorted = Array.from(colorCounts.entries())
            .sort((a, b) => b[1] - a[1]);

          // Take the top 2 buckets and convert to hex color strings
          const topColors: string[] = sorted.slice(0, 2).map(([key]) => {
            // key = "bucketR-bucketG-bucketB"
            const [r, g, b] = key.split('-').map(Number);

            // Convert to hex: pad each channel to 2 digits, e.g. 32 → "20"
            const toHex = (n: number) => n.toString(16).padStart(2, '0');
            return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
          });

          resolve(topColors);
        } catch {
          // If anything goes wrong inside the drawing logic, return empty —
          // the preview will just use the vibe theme colors unchanged.
          resolve([]);
        }
      };

      // If the image fails to load (corrupt data, unsupported format, etc.),
      // return empty — never crash the UI.
      img.onerror = () => resolve([]);

      // Assign the base64 data URL to the image src — this triggers onload.
      img.src = base64DataUrl;

    } catch {
      // Catch any synchronous errors (e.g. canvas not supported in some envs)
      resolve([]);
    }
  });
}
