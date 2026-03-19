"use client";

import { useCallback, useEffect, useRef } from "react";
import type { AssetData } from "@/features/assets/types";

type BitmapSource = ImageBitmap | HTMLCanvasElement | HTMLImageElement;

type ParticleData = {
  asset: AssetData;
  x: number;
  y: number;
  size: number;
  floatPhase: number;
  floatSpeed: number;
  floatAmplitude: number;
  color: string;
  bitmap?: BitmapSource;
  scale: number;
  vx: number;
  vy: number;
  noiseSeed: number;
  removing?: boolean;
};

type SizeState = {
  width: number;
  height: number;
  dpr: number;
};

const INTEGRATION_DT = 0.016;
const MAX_DPR = 1.5;
const MAX_PARTICLES = 180;
const BITMAP_SIZE = 96;

const imageCache = new Map<
  string,
  Promise<BitmapSource | null> | BitmapSource | null
>();

const randomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 70%)`;
};

const safeDpr = () => Math.min(window.devicePixelRatio || 1, MAX_DPR);

const getTargetCount = (width: number, height: number, density: number) =>
  Math.min(Math.floor(width * height * density), MAX_PARTICLES);

const getCoverDrawRect = (
  sourceWidth: number,
  sourceHeight: number,
  destSize: number,
) => {
  const scale = Math.max(destSize / sourceWidth, destSize / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;
  return {
    x: (destSize - drawWidth) / 2,
    y: (destSize - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  };
};

const createCircularBitmap = async (
  image: HTMLImageElement,
): Promise<BitmapSource> => {
  const canvas = document.createElement("canvas");
  canvas.width = BITMAP_SIZE;
  canvas.height = BITMAP_SIZE;
  const context = canvas.getContext("2d");
  if (!context) return image;

  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const rect = getCoverDrawRect(sourceWidth, sourceHeight, BITMAP_SIZE);

  context.save();
  context.beginPath();
  context.arc(
    BITMAP_SIZE / 2,
    BITMAP_SIZE / 2,
    BITMAP_SIZE / 2,
    0,
    Math.PI * 2,
  );
  context.clip();
  context.drawImage(image, rect.x, rect.y, rect.width, rect.height);
  context.restore();

  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(canvas);
    } catch {
      return canvas;
    }
  }

  return canvas;
};

const loadBitmap = (url?: string): Promise<BitmapSource | null> => {
  if (!url) return Promise.resolve(null);

  const cached = imageCache.get(url);
  if (cached instanceof HTMLImageElement) return Promise.resolve(cached);
  if (cached instanceof HTMLCanvasElement) return Promise.resolve(cached);
  if (cached instanceof ImageBitmap) return Promise.resolve(cached);
  if (cached === null) return Promise.resolve(null);
  if (cached) return cached;

  const promise = new Promise<BitmapSource | null>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = async () => {
      try {
        const bitmap = await createCircularBitmap(img);
        resolve(bitmap);
      } catch {
        resolve(img);
      }
    };
    img.onerror = () => resolve(null);
    img.src = `/proxy/core/storage/${url}`;

    if (typeof img.decode === "function") {
      img.decode().catch(() => {});
    }
  }).then((result) => {
    imageCache.set(url, result);
    return result;
  });

  imageCache.set(url, promise);
  return promise;
};

const createParticle = (
  asset: AssetData,
  width: number,
  height: number,
  sizeMin: number,
  sizeMax: number,
): ParticleData => {
  const size = sizeMin + Math.random() * (sizeMax - sizeMin);
  const duration = 4 + Math.random() * 5;
  const particle: ParticleData = {
    asset,
    x: Math.random() * width,
    y: Math.random() * height,
    size,
    floatPhase: Math.random() * Math.PI * 2,
    floatSpeed: (Math.PI * 2) / duration,
    floatAmplitude: 8 + Math.random() * 22,
    color: randomColor(),
    scale: 0,
    vx: 0,
    vy: 0,
    noiseSeed: Math.random() * Math.PI * 2,
  };

  if (asset.image_url) {
    void loadBitmap(asset.image_url).then((bitmap) => {
      if (bitmap) particle.bitmap = bitmap;
    });
  }

  return particle;
};

const applyCursorRepel = (
  particle: ParticleData,
  cursor: { x: number; y: number; active: boolean },
  repelDistance: number,
  forceStrength: number,
) => {
  if (!cursor.active) return;

  const dx = cursor.x - particle.x;
  const dy = cursor.y - particle.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < repelDistance && dist > 1) {
    const force = ((repelDistance - dist) / repelDistance) * forceStrength;
    particle.vx += (-dx / dist) * force;
    particle.vy += (-dy / dist) * force;
  }
};

const applyFriction = (particle: ParticleData, friction: number, dt: number) => {
  const factor = Math.pow(friction, dt / INTEGRATION_DT);
  particle.vx *= factor;
  particle.vy *= factor;
};

const clampSpeed = (particle: ParticleData, maxSpeed: number) => {
  const speed = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
  if (speed > maxSpeed) {
    particle.vx = (particle.vx / speed) * maxSpeed;
    particle.vy = (particle.vy / speed) * maxSpeed;
  }
};

const integrate = (particle: ParticleData, dt: number) => {
  particle.x += particle.vx * dt;
  particle.y += particle.vy * dt;
};

const bounceOffEdges = (
  particle: ParticleData,
  bounds: { width: number; height: number },
) => {
  const half = particle.size / 2;
  if (particle.x < half || particle.x > bounds.width - half) {
    particle.vx = -particle.vx;
  }
  if (particle.y < half || particle.y > bounds.height - half) {
    particle.vy = -particle.vy;
  }
};

const updateScale = (particle: ParticleData, dt: number): boolean => {
  if (particle.removing) {
    particle.scale -= dt * 2.4;
    return particle.scale <= 0;
  }
  particle.scale += (1 - particle.scale) * 0.08;
  return false;
};

const drawParticle = (
  context: CanvasRenderingContext2D,
  particle: ParticleData,
  x: number,
  y: number,
  scaledSize: number,
) => {
  if (particle.bitmap) {
    context.drawImage(
      particle.bitmap,
      x - scaledSize / 2,
      y - scaledSize / 2,
      scaledSize,
      scaledSize,
    );
    return;
  }

  context.beginPath();
  context.arc(x, y, scaledSize / 2, 0, 2 * Math.PI);
  context.fillStyle = particle.color;
  context.fill();

  context.fillStyle = "white";
  context.font = `${Math.floor(scaledSize / 2)}px sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(particle.asset.symbol[0]?.toUpperCase() ?? "?", x, y + 1);
};

export default function AssetBackground({
  assets,
  sizeMin = 16,
  sizeMax = 32,
  density = 0.0003,
}: {
  assets: AssetData[];
  sizeMin?: number;
  sizeMax?: number;
  density?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<ParticleData[]>([]);
  const cursorRef = useRef({ x: -1000, y: -1000, active: false });
  const sizeRef = useRef<SizeState>({ width: 0, height: 0, dpr: 1 });
  const frameBufferRef = useRef<HTMLCanvasElement | null>(null);

  const updateParticles = useCallback(
    (width: number, height: number) => {
      if (assets.length === 0) return;

      const targetCount = getTargetCount(width, height, density);
      const currentCount = particlesRef.current.length;

      if (targetCount > currentCount) {
        const numToAdd = targetCount - currentCount;
        const newParticles = Array.from({ length: numToAdd }, () => {
          const asset = assets[Math.floor(Math.random() * assets.length)];
          return createParticle(asset, width, height, sizeMin, sizeMax);
        });
        particlesRef.current.push(...newParticles);
        return;
      }

      if (targetCount < currentCount) {
        particlesRef.current.slice(targetCount).forEach((particle) => {
          particle.removing = true;
        });
      }
    },
    [assets, density, sizeMin, sizeMax],
  );

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const handlePointerMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      cursorRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      };
    };

    const handlePointerLeave = () => {
      cursorRef.current = { x: -1000, y: -1000, active: false };
    };

    node.addEventListener("pointermove", handlePointerMove, { passive: true });
    node.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    return () => {
      node.removeEventListener("pointermove", handlePointerMove);
      node.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const resize = (width: number, height: number) => {
      const prev = sizeRef.current;
      if (width === prev.width && height === prev.height && prev.dpr === safeDpr()) {
        return;
      }

      if (prev.width > 0 && prev.height > 0) {
        if (!frameBufferRef.current) {
          frameBufferRef.current = document.createElement("canvas");
        }
        const buffer = frameBufferRef.current;
        buffer.width = canvas.width;
        buffer.height = canvas.height;
        const bufferContext = buffer.getContext("2d");
        if (bufferContext) {
          bufferContext.setTransform(1, 0, 0, 1, 0, 0);
          bufferContext.clearRect(0, 0, buffer.width, buffer.height);
          bufferContext.drawImage(canvas, 0, 0);
        }
      }

      const dpr = safeDpr();
      sizeRef.current = { width, height, dpr };
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const buffer = frameBufferRef.current;
      if (buffer) {
        context.clearRect(0, 0, width, height);
        context.drawImage(buffer, 0, 0, width, height);
      }

      updateParticles(width, height);
    };

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      resize(width, height);
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [updateParticles]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let animationFrameId = 0;
    let lastTime = performance.now();

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

    const repelDistance = 140;
    const forceStrength = 75;
    const maxSpeed = 70;
    const friction = 0.88;

    const animate = (time: number) => {
      const { width, height } = sizeRef.current;
      if (width === 0 || height === 0) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;

      context.clearRect(0, 0, width, height);

      const elapsed = time / 1000;
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const particle = particlesRef.current[i];
        const floatY =
          Math.sin(elapsed * particle.floatSpeed + particle.floatPhase) *
          particle.floatAmplitude;

        applyCursorRepel(
          particle,
          cursorRef.current,
          repelDistance,
          forceStrength,
        );

        particle.vx += Math.sin(elapsed + particle.noiseSeed) * 0.06;
        particle.vy += Math.cos(elapsed * 0.9 + particle.noiseSeed) * 0.06;

        applyFriction(particle, friction, dt);
        clampSpeed(particle, maxSpeed);
        integrate(particle, dt);
        bounceOffEdges(particle, { width, height });

        if (updateScale(particle, dt)) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const scaledSize = particle.size * particle.scale;
        drawParticle(context, particle, particle.x, particle.y + floatY, scaledSize);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if (!reduceMotion) {
      animationFrameId = requestAnimationFrame(animate);
    } else {
      const { width, height } = sizeRef.current;
      if (width > 0 && height > 0) {
        context.clearRect(0, 0, width, height);
        particlesRef.current.forEach((particle) => {
          const scaledSize = particle.size * Math.max(particle.scale, 0.6);
          drawParticle(context, particle, particle.x, particle.y, scaledSize);
        });
      }
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const { width, height } = sizeRef.current;
    if (width === 0 || height === 0) return;
    updateParticles(width, height);
  }, [updateParticles]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      />
    </div>
  );
}
