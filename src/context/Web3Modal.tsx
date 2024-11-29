'use client';

import React, { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { useWagmiConfig } from '@/context/WagmiConfig';
import { createWeb3Modal } from '@web3modal/wagmi/react';

const queryClient = new QueryClient();

export const dynamic = 'force-dynamic';
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'a8a94eaa29bf7b1d3a0d94172c58e6ac';

export function Web3Modal({ children }: { children: ReactNode }) {
  const wagmiConfig = useWagmiConfig();

  useEffect(() => {
    async function initWagmiConfig() {
      if (typeof window === 'undefined') return;

      try {
        const { TomoWalletTgSdkV2 } = await import('@tomo-inc/tomo-telegram-sdk');
        new TomoWalletTgSdkV2({ injected: true });
      } catch (error) {
        console.error('Failed to initialize Tomo Wallet:', error);
      }
    }

    initWagmiConfig();
  }, []);

  useEffect(() => {
    if (!wagmiConfig) return;
    
    try {
      createWeb3Modal({
        wagmiConfig,
        // projectId,
        themeMode: 'dark',
      });
    } catch (error) {
      console.error('Failed to initialize Web3Modal:', error);
    }
  }, [wagmiConfig]);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
