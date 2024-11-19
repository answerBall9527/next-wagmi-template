'use client';

import { useEffect, useRef } from 'react';

export function useVConsole() {
  const initialized = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized.current) {
      initialized.current = true;
      console.log('🔧 正在初始化 vConsole...');
      
      import('vconsole').then(({ default: VConsole }) => {
        const vConsole = new VConsole({ theme: 'dark' });
        console.log('✅ vConsole 初始化成功');
        
        // 强制刷新一下控制台
        setTimeout(() => {
          vConsole.show();
        }, 100);
      });
    }
  }, []);
} 