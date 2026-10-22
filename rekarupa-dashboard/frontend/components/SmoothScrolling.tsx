"use client";
import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

export default function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Inisialisasi instance Lenis dengan parameter kurva easing
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), 
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
    });

    // Menghubungkan Lenis dengan Request Animation Frame (RAF) bawaan peramban
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Pembersihan memori (garbage collection) saat komponen dilepas
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}