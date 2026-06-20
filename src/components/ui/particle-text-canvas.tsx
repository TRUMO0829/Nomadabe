"use client";

import React, { useEffect, useRef } from "react";

type ParticleTextProps = {
  text?: string;
  className?: string;
  canvasClassName?: string;
  colors?: [string, string, string];
  particleGap?: number;
  particleSize?: number;
  mouseRadius?: number;
};

type MouseState = {
  x: number | null;
  y: number | null;
  radius: number;
};

class Particle {
  x: number;
  y: number;
  color: string;
  size: number;
  baseX: number;
  baseY: number;
  density: number;

  constructor(x: number, y: number, color: string, size: number) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.baseX = x;
    this.baseY = y;
    this.density = Math.random() * 34 + 6;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }

  update(mouse: MouseState) {
    if (mouse.x === null || mouse.y === null) {
      this.returnToBase();
      return;
    }

    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0 && distance < mouse.radius) {
      const force = (mouse.radius - distance) / mouse.radius;
      const directionX = (dx / distance) * force * this.density;
      const directionY = (dy / distance) * force * this.density;
      this.x -= directionX;
      this.y -= directionY;
      return;
    }

    this.returnToBase();
  }

  private returnToBase() {
    if (this.x !== this.baseX) {
      this.x -= (this.x - this.baseX) / 10;
    }

    if (this.y !== this.baseY) {
      this.y -= (this.y - this.baseY) / 10;
    }
  }
}

function getFontSize(width: number, height: number, text: string) {
  const byWidth = width / Math.max(text.length * 0.72, 5);
  const byHeight = height * 0.58;
  return Math.max(54, Math.min(byWidth, byHeight, 190));
}

export default function ParticleText({
  text = "Vibe",
  className = "",
  canvasClassName = "",
  colors = ["#fff8ea", "#d8bb72", "#f5e5b3"],
  particleGap = 4,
  particleSize = 1.55,
  mouseRadius = 150,
}: ParticleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef<MouseState>({ x: null, y: null, radius: mouseRadius });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId = 0;

    const setCanvasSize = () => {
      const bounds = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(bounds.width));
      canvas.height = Math.max(1, Math.floor(bounds.height));
    };

    const init = () => {
      particles = [];
      setCanvasSize();

      let fontSize = getFontSize(canvas.width, canvas.height, text);
      const textX = canvas.width / 2;
      const textY = canvas.height / 2;
      const maxTextWidth = canvas.width * 0.92;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `400 ${fontSize}px Montserrat, Arial, Helvetica, sans-serif`;
      while (fontSize > 34 && ctx.measureText(text).width > maxTextWidth) {
        fontSize *= 0.92;
        ctx.font = `400 ${fontSize}px Montserrat, Arial, Helvetica, sans-serif`;
      }
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      gradient.addColorStop(0.08, colors[0]);
      gradient.addColorStop(0.5, colors[1]);
      gradient.addColorStop(0.92, colors[2]);
      ctx.fillStyle = gradient;
      ctx.fillText(text, textX, textY);

      const textCoordinates = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < textCoordinates.height; y += particleGap) {
        for (let x = 0; x < textCoordinates.width; x += particleGap) {
          const alphaIndex = y * 4 * textCoordinates.width + x * 4 + 3;

          if (textCoordinates.data[alphaIndex] > 128) {
            const r = textCoordinates.data[alphaIndex - 3];
            const g = textCoordinates.data[alphaIndex - 2];
            const b = textCoordinates.data[alphaIndex - 1];
            particles.push(new Particle(x, y, `rgb(${r},${g},${b})`, particleSize));
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.draw(ctx);
        particle.update(mouse.current);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const bounds = canvas.getBoundingClientRect();
      mouse.current.x = event.clientX - bounds.left;
      mouse.current.y = event.clientY - bounds.top;
    };

    const handleMouseLeave = () => {
      mouse.current.x = null;
      mouse.current.y = null;
    };

    const resizeObserver = new ResizeObserver(init);
    resizeObserver.observe(container);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    init();
    animate();
    void document.fonts?.ready.then(init);

    return () => {
      resizeObserver.disconnect();
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [canvasClassName, colors, mouseRadius, particleGap, particleSize, text]);

  return (
    <div ref={containerRef} className={className}>
      <canvas ref={canvasRef} className={`block h-full w-full ${canvasClassName}`} />
    </div>
  );
}
