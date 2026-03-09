'use client';

import { useState, useEffect } from 'react';
import { Logo } from '@/components/ui/logo';

const SCROLL_THRESHOLD = 24;

export function HeaderLogo() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Logo
      className={`transition-[height] duration-200 ${
        scrolled ? 'h-16' : 'h-20'
      }`}
    />
  );
}
