'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Web3Modal } from '@/context/Web3Modal';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useVConsole } from '@/hooks/useVConsole';
import { WagmiConfigProvider } from '@/context/WagmiConfig';
import BottomNav from '@/components/layout/BottomNav';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

// 在组件外初始化 vConsole
if (typeof window !== 'undefined') {
  import('vconsole').then(({ default: VConsole }) => {
    console.log('🔧 正在初始化 vConsole...');
    const vConsole = new VConsole({ theme: 'dark' });
    console.log('✅ vConsole 初始化成功');
    
    // 确保 vConsole 显示
    setTimeout(() => {
      vConsole.show();
    }, 100);
  });
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // 判断是否需要显示底部导航
  const shouldShowBottomNav = !['/'].includes(pathname);

  return (
    <html lang="en">
      <body className={inter.className}>
        <WagmiConfigProvider>
          <Web3Modal>
            <main className="min-h-screen relative pb-[100px]">
              {children}
              {shouldShowBottomNav && <BottomNav />}
              <Toaster position="top-center" reverseOrder={false} />
            </main>
          </Web3Modal>
        </WagmiConfigProvider>
      </body>
    </html>
  );
}
