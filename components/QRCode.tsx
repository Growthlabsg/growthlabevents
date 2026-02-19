'use client';

import { useEffect, useRef } from 'react';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * QR Code component using canvas
 * Generates a QR code pattern for the given value
 */
export function QRCode({ value, size = 200, className = '' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !value) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas with white background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);

    // Generate a simple QR-like pattern
    // For production, use a library like qrcode.react or qrcode
    const moduleSize = Math.floor(size / 25);
    const modules = 25;

    // Create a deterministic pattern based on value
    const hash = value.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

    ctx.fillStyle = '#000000';

    // Draw modules
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Skip finder pattern areas
        const isFinderPattern = 
          (row < 9 && col < 9) || // Top-left
          (row < 9 && col >= modules - 9) || // Top-right
          (row >= modules - 9 && col < 9); // Bottom-left

        if (isFinderPattern) {
          // Draw finder pattern
          const isOuter = row < 2 || row >= 7 || col < 2 || col >= 7;
          const isInner = row >= 2 && row < 7 && col >= 2 && col < 7;
          
          if (isOuter) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          } else if (isInner && (row === 3 || row === 4 || row === 5) && (col === 3 || col === 4 || col === 5)) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        } else {
          // Generate pattern based on hash and position
          const patternValue = (hash + row * modules + col) % 2;
          if (patternValue === 0) {
            ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
          }
        }
      }
    }
  }, [value, size]);

  return (
    <div className={`inline-block ${className}`}>
      <canvas
        ref={canvasRef}
        className="border border-slate-200 dark:border-slate-700 rounded-lg bg-white"
        style={{ imageRendering: 'crisp-edges' }}
      />
    </div>
  );
}
