import * as THREE from 'three';

let cachedCanvasWeave: THREE.CanvasTexture | null = null;
let cachedPlasterBump: THREE.CanvasTexture | null = null;
let cachedLightHalo: THREE.CanvasTexture | null = null;
let cachedLightCone: THREE.CanvasTexture | null = null;

/**
 * Generates a fine-art woven linen canvas bump map.
 * Gives every painting authentic woven fabric micro-relief under gallery lamps
 * while keeping roughness at 1.0 (zero specular hotspot).
 */
export function getCanvasWeaveTexture(): THREE.CanvasTexture {
  if (cachedCanvasWeave) return cachedCanvasWeave;

  const size = 128;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Fine warp & weft linen threads
  for (let y = 0; y < size; y += 2) {
    for (let x = 0; x < size; x += 2) {
      const isWarp = ((x + y) % 4) === 0;
      const noise = (Math.random() - 0.5) * 18;
      const val = Math.min(255, Math.max(0, (isWarp ? 148 : 112) + noise));
      ctx.fillStyle = `rgb(${val},${val},${val})`;
      ctx.fillRect(x, y, 2, 1);
      ctx.fillRect(x, y + 1, 1, 2);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(18, 18);
  texture.needsUpdate = true;

  cachedCanvasWeave = texture;
  return texture;
}

/**
 * Generates a subtle Venetian plaster / mineral micro-cement bump map for museum walls.
 */
export function getPlasterWallTexture(): THREE.CanvasTexture {
  if (cachedPlasterBump) return cachedPlasterBump;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  // Organic mineral clouds & fine trowel grain
  for (let i = 0; i < 1800; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = 2 + Math.random() * 14;
    const alpha = 0.02 + Math.random() * 0.04;
    ctx.fillStyle = Math.random() > 0.5 ? `rgba(210,210,210,${alpha})` : `rgba(50,50,50,${alpha})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 2.5);
  texture.needsUpdate = true;

  cachedPlasterBump = texture;
  return texture;
}

/**
 * Generates a soft scalloped radial museum spotlight wash texture
 * that sits on the wall behind each frame to simulate halogen wall grazing.
 */
export function getLightHaloTexture(): THREE.CanvasTexture {
  if (cachedLightHalo) return cachedLightHalo;

  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);

  // Slightly higher focal center to match overhead picture lamp throw
  const grad = ctx.createRadialGradient(
    size * 0.5,
    size * 0.42,
    size * 0.05,
    size * 0.5,
    size * 0.48,
    size * 0.5
  );
  grad.addColorStop(0.0, 'rgba(255, 241, 212, 0.42)');
  grad.addColorStop(0.35, 'rgba(255, 236, 200, 0.22)');
  grad.addColorStop(0.68, 'rgba(245, 218, 175, 0.07)');
  grad.addColorStop(1.0, 'rgba(245, 218, 175, 0.0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  cachedLightHalo = texture;
  return texture;
}

/**
 * Generates a soft volumetric light beam cone texture emitted downward
 * from the brass picture lamp hood onto the artwork below.
 */
export function getLightConeTexture(): THREE.CanvasTexture {
  if (cachedLightCone) return cachedLightCone;

  const w = 128;
  const h = 256;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, w, h);

  // Vertical attenuation from top lamp hood (y=0) downward
  const vGrad = ctx.createLinearGradient(0, 0, 0, h);
  vGrad.addColorStop(0.0, 'rgba(255, 244, 218, 0.32)');
  vGrad.addColorStop(0.3, 'rgba(255, 240, 210, 0.12)');
  vGrad.addColorStop(0.75, 'rgba(255, 235, 200, 0.03)');
  vGrad.addColorStop(1.0, 'rgba(255, 235, 200, 0.0)');

  ctx.fillStyle = vGrad;
  ctx.fillRect(0, 0, w, h);

  // Horizontal edge feathering
  ctx.globalCompositeOperation = 'destination-in';
  const hGrad = ctx.createLinearGradient(0, 0, w, 0);
  hGrad.addColorStop(0.0, 'rgba(0, 0, 0, 0.0)');
  hGrad.addColorStop(0.2, 'rgba(0, 0, 0, 1.0)');
  hGrad.addColorStop(0.8, 'rgba(0, 0, 0, 1.0)');
  hGrad.addColorStop(1.0, 'rgba(0, 0, 0, 0.0)');
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, w, h);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  cachedLightCone = texture;
  return texture;
}
