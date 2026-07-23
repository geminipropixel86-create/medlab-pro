'use client';
import { useState, useEffect, useRef, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsLeaving(true);
      setTimeout(() => setIsVisible(false), 400);
    };

    const handleRouteChangeComplete = () => {
      setIsLeaving(false);
      setTimeout(() => setIsVisible(true), 50);
    };

    router.events.on('routeChangeStart', handleRouteChangeStart);
    router.events.on('routeChangeComplete', handleRouteChangeComplete);

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  return (
    <div
      ref={containerRef}
      className="transition-all duration-500"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible
          ? 'perspective(1200px) rotateX(0deg) translateY(0) scale(1)'
          : isLeaving
            ? 'perspective(1200px) rotateX(5deg) translateY(-20px) scale(0.97)'
            : 'perspective(1200px) rotateX(-3deg) translateY(20px) scale(0.98)',
        filter: isVisible ? 'blur(0px)' : 'blur(4px)',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}