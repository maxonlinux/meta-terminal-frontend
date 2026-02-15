"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { AssetData } from "@/features/assets/types";

type ParticleData = {
  asset: AssetData;
  baseX: number;
  baseY: number;
  size: number;
  floatDuration: number;
  floatAmplitude: number;
  floatOffset: number;
  color: string;
  image?: HTMLImageElement;
  scale: number;
  vx: number;
  vy: number;
  removing?: boolean;
};

const INTEGRATION_DT = 0.016;

const randomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 70%)`;
};

function computeFloatY(p: ParticleData, elapsed: number) {
  return (
    Math.sin((elapsed * (2 * Math.PI)) / p.floatDuration + p.floatOffset) *
    p.floatAmplitude
  );
}

function applyCursorRepel(params: {
  particle: ParticleData;
  cursor: { x: number; y: number };
  repelDistance: number;
  forceStrength: number;
}) {
  const { particle, cursor, repelDistance, forceStrength } = params;

  const dx = cursor.x - particle.baseX;
  const dy = cursor.y - particle.baseY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < repelDistance && dist > 1) {
    const force = ((repelDistance - dist) / repelDistance) * forceStrength;
    particle.vx += (-dx / dist) * force;
    particle.vy += (-dy / dist) * force;
  }
}

function applyNoise(p: ParticleData) {
  p.vx += (Math.random() - 0.5) * 0.6;
  p.vy += (Math.random() - 0.5) * 0.6;
}

function applyFriction(p: ParticleData, friction: number) {
  p.vx *= friction;
  p.vy *= friction;
}

function clampSpeed(p: ParticleData, maxSpeed: number) {
  const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
  if (speed > maxSpeed) {
    p.vx = (p.vx / speed) * maxSpeed;
    p.vy = (p.vy / speed) * maxSpeed;
  }
}

function integrate(p: ParticleData, dt: number) {
  p.baseX += p.vx * dt;
  p.baseY += p.vy * dt;
}

function bounceOffEdges(
  p: ParticleData,
  bounds: { width: number; height: number },
) {
  const half = p.size / 2;
  if (p.baseX < half || p.baseX > bounds.width - half) p.vx = -p.vx;
  if (p.baseY < half || p.baseY > bounds.height - half) p.vy = -p.vy;
}

function updateScale(p: ParticleData): boolean {
  if (p.removing) {
    p.scale -= 0.05;
    return p.scale <= 0;
  }
  p.scale += (1 - p.scale) * 0.05;
  return false;
}

function drawParticle(
  context: CanvasRenderingContext2D,
  p: ParticleData,
  x: number,
  y: number,
  scaledSize: number,
) {
  if (p.image) {
    context.save();
    context.beginPath();
    context.arc(x, y, scaledSize / 2, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    context.drawImage(
      p.image,
      x - scaledSize / 2,
      y - scaledSize / 2,
      scaledSize,
      scaledSize,
    );
    context.restore();
    return;
  }

  context.beginPath();
  context.arc(x, y, scaledSize / 2, 0, 2 * Math.PI);
  context.fillStyle = p.color;
  context.fill();

  context.fillStyle = "white";
  context.font = `${Math.floor(scaledSize / 2)}px sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(p.asset.symbol[0]?.toUpperCase() ?? "?", x, y + 1);
}

const preloadImage = (url?: string): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    if (!url) return resolve(null);

    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = `/proxy/core/storage/${url}`;
  });

const createParticle = async (
  asset: AssetData,
  width: number,
  height: number,
  sizeMin: number,
  sizeMax: number,
): Promise<ParticleData> => {
  const particle: ParticleData = {
    asset,
    baseX: Math.random() * width,
    baseY: Math.random() * height,
    size: sizeMin + Math.random() * (sizeMax - sizeMin),
    floatDuration: 4 + Math.random() * 4,
    floatAmplitude: 10 + Math.random() * 20,
    floatOffset: Math.random() * 2 * Math.PI,
    color: randomColor(),
    scale: 0,
    vx: 0,
    vy: 0,
  };

  if (asset.image_url) {
    const img = await preloadImage(asset.image_url);
    particle.image = img || undefined;
  }

  return particle;
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
  const cursorRef = useRef({ x: -1000, y: -1000 });
  const [size, setSize] = useState({ width: 0, height: 0 });

  const updateParticles = useCallback(
    async (width: number, height: number) => {
      const targetCount = Math.floor(width * height * density);
      const currentCount = particlesRef.current.length;

      if (targetCount > currentCount) {
        const numToAdd = targetCount - currentCount;

        for (let i = 0; i < numToAdd; i++) {
          const asset = assets[Math.floor(Math.random() * assets.length)];
          const particle = await createParticle(
            asset,
            width,
            height,
            sizeMin,
            sizeMax,
          );
          // Push only *after* image loaded or failed:
          particlesRef.current.push(particle);
        }
      } else if (targetCount < currentCount) {
        particlesRef.current.slice(targetCount).forEach((p) => {
          p.removing = true;
        });
      }
    },
    [assets, density, sizeMin, sizeMax],
  );

  // Initial creation
  useEffect(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();

    setSize({ width, height });
    void updateParticles(width, height);
  }, [updateParticles]);

  // Smooth resize handling with graceful removal
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const { width: newWidth, height: newHeight } =
        containerRef.current.getBoundingClientRect();

      const scaleX = newWidth / size.width;
      const scaleY = newHeight / size.height;

      particlesRef.current.forEach((p) => {
        p.baseX *= scaleX;
        p.baseY *= scaleY;
      });

      setSize({ width: newWidth, height: newHeight });
      void updateParticles(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [size, updateParticles]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      cursorRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Animation loop with appear and disappear animations
  useEffect(() => {
    let animationFrameId: number;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    const repelDistance = 150;
    const forceStrength = 80;
    const maxSpeed = 60;
    const friction = 0.85;
    const startTime = performance.now();

    const animate = (time: number) => {
      const elapsed = (time - startTime) / 1000;
      context.clearRect(0, 0, size.width, size.height);

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        const floatY = computeFloatY(p, elapsed);

        applyCursorRepel({
          particle: p,
          cursor: cursorRef.current,
          repelDistance,
          forceStrength,
        });
        applyNoise(p);
        applyFriction(p, friction);
        clampSpeed(p, maxSpeed);
        integrate(p, INTEGRATION_DT);
        bounceOffEdges(p, size);

        if (updateScale(p)) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        const scaledSize = p.size * p.scale;
        const x = p.baseX;
        const y = p.baseY + floatY;
        drawParticle(context, p, x, y, scaledSize);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [size]);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        width={size.width}
        height={size.height}
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      />
    </div>
  );
}
