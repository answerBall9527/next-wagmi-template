'use client';

import { useEffect } from 'react';

export function useVConsole() {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('vconsole').then(({ default: VConsole }) => {
        new VConsole();
      });
    }
  }, []);
} 