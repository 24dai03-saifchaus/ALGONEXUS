import React, { useEffect, useRef } from "react";
import { Step } from "../types";

interface VisualizationCanvasProps {
  step: Step;
  prevStep?: Step;
  delay: number;
}

const VisualizationCanvas: React.FC<VisualizationCanvasProps> = ({ step, prevStep, delay }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(null);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const duration = Math.max(100, delay * 0.8);
    startTimeRef.current = performance.now();

    const drawArrow = (x: number, y: number, color: string, label: string) => {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = color;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = 2;

      // Arrow stem
      ctx.beginPath();
      ctx.moveTo(x, y - 80);
      ctx.lineTo(x, y - 40);
      ctx.stroke();

      // Arrow head
      ctx.beginPath();
      ctx.moveTo(x - 10, y - 50);
      ctx.lineTo(x, y - 40);
      ctx.lineTo(x + 10, y - 50);
      ctx.stroke();

      // Label
      ctx.font = "bold 12px Space Grotesk";
      ctx.textAlign = "center";
      ctx.fillText(label, x, y - 90);
      ctx.restore();
    };

    const animate = (time: number) => {
      const elapsed = time - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      const t = ease(progress);

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw Grid Background
      ctx.strokeStyle = "rgba(0, 0, 0, 0.03)";
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < rect.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, rect.height);
        ctx.stroke();
      }
      for (let y = 0; y < rect.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(rect.width, y);
        ctx.stroke();
      }

      const { array, highlights, swaps, found } = step;
      const n = array.length;
      const padding = 80;
      const availableWidth = rect.width - padding * 2;
      const barWidth = Math.min(80, (availableWidth / n) - 20);
      const startX = (rect.width - (barWidth + 20) * n) / 2;
      const maxVal = Math.max(...array, 1);
      const baseLineY = rect.height - 100;

      array.forEach((val, i) => {
        let x = startX + i * (barWidth + 20);
        let y = baseLineY;
        let scale = 1;

        // Handle Swap Animation (Positional interpolation)
        if (swaps.length === 2 && swaps.includes(i) && progress < 1) {
          const otherIdx = swaps[0] === i ? swaps[1] : swaps[0];
          const prevX = startX + otherIdx * (barWidth + 20);
          const currentX = startX + i * (barWidth + 20);
          
          // Interpolate X position
          x = prevX + (currentX - prevX) * t;
          
          // Add an arc effect (y-offset)
          const arcHeight = 80;
          y = baseLineY - Math.sin(Math.PI * t) * (i > otherIdx ? arcHeight : -arcHeight);
          
          // Slight scale up during swap
          scale = 1 + Math.sin(Math.PI * t) * 0.1;
        }

        const barHeight = (val / maxVal) * (rect.height - 300);
        const topY = y - barHeight;

        let color = "rgba(0, 0, 0, 0.05)";
        let glowColor = "transparent";
        let isActive = false;
        let label = "";

        if (highlights.includes(i)) {
          color = "#2563eb"; // Primary Blue
          glowColor = "rgba(37, 99, 235, 0.2)";
          isActive = true;
          label = "COMPARE";
        }
        if (swaps.includes(i)) {
          color = "#7c3aed"; // Secondary Violet
          glowColor = "rgba(124, 58, 237, 0.2)";
          isActive = true;
          label = "SWAP";
        }
        if (found === i) {
          color = "#059669"; // Accent Emerald
          glowColor = "rgba(5, 150, 105, 0.2)";
          isActive = true;
          label = "FOUND";
        }

        ctx.save();
        ctx.translate(x + barWidth / 2, y);
        ctx.scale(scale, scale);

        // Draw Block Shadow/Glow
        if (isActive) {
          ctx.shadowBlur = 20 * (isActive ? (swaps.includes(i) ? 1 : t) : 0);
          ctx.shadowColor = glowColor;
          if (progress > 0.5 || !swaps.includes(i)) {
            drawArrow(0, -barHeight - 20, color, label);
          }
        }

        // Draw Bar (Height based on value)
        const gradient = ctx.createLinearGradient(-barWidth/2, -barHeight, barWidth/2, 0);
        gradient.addColorStop(0, isActive ? color : "rgba(0, 0, 0, 0.05)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 0.1)");
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(-barWidth/2, -barHeight, barWidth, barHeight, 8);
        ctx.fill();

        // Draw Border
        ctx.strokeStyle = isActive ? color : "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = isActive ? 3 : 1;
        ctx.stroke();

        // Draw Value Text
        ctx.shadowBlur = 0;
        ctx.fillStyle = isActive ? color : "rgba(0, 0, 0, 0.4)";
        ctx.font = `bold ${Math.max(14, barWidth / 3)}px JetBrains Mono`;
        ctx.textAlign = "center";
        ctx.fillText(val.toString(), 0, -barHeight - 15);

        // Draw Index Label
        ctx.font = "10px Inter";
        ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
        ctx.fillText(`IDX:${i}`, 0, 25);

        ctx.restore();
      });

      // Draw "Scanning" Line Effect
      const scanY = (time / 3) % rect.height;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(rect.width, scanY);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.02)";
      ctx.lineWidth = 1;
      ctx.stroke();

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [step, prevStep, delay]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
};

export default VisualizationCanvas;
