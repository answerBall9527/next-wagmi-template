'use client';

import React, { ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { useWagmiConfig } from '@/hooks/useWagmiConfig';
import { createWeb3Modal } from '@web3modal/wagmi/react';

const queryClient = new QueryClient();

export const dynamic = 'force-dynamic';
const projectId = 'a8a94eaa29bf7b1d3a0d94172c58e6ac';

export function Web3Modal({ children, initialState }: { children: ReactNode; initialState?: any }) {
  const wagmiConfig = useWagmiConfig();

  useEffect(() => {
    async function initWagmiConfig() {
      if (typeof window === 'undefined') return;

      // 动态导入依赖模块
      const { TomoWalletTgSdkV2 } = await import('@tomo-inc/tomo-telegram-sdk');
      new TomoWalletTgSdkV2({ injected: true })
    }

    initWagmiConfig();
  }, []);




  if (!wagmiConfig) return null;

  createWeb3Modal({
    wagmiConfig: wagmiConfig,
    projectId,
    themeMode: 'dark',
  });

  return (
    <WagmiProvider config={wagmiConfig} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
