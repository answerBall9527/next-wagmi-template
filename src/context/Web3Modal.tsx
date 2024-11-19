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


      const customInjectedConnector = {
        id: 'tomowallet',
        name: 'TomoWallet Provider',
        type: 'custom',
        supportsSimulation: true,

        async connect() {
          if (typeof window === 'undefined' || !window.ethereum) return {};
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          return {
            accounts,
            chainId: parseInt(chainId),
          };
        },

        async getProvider() {
          return typeof window !== 'undefined' ? window.ethereum : null;
        },
      };

      // const customTomo1 = injected({
      //   shimDisconnect: true,
      //   target: () => (typeof window !== 'undefined' && window.ethereum ? { provider: window.ethereum } : null),
      // });

      // const config = defaultWagmiConfig({
      //   chains: [mainnet, sepolia, bscTestnet, base],
      //   projectId,
      //   ssr: false,
      //   storage: createStorage({ storage: cookieStorage }),
      //   connectors: [customInjectedConnector, customTomo1],
      // });

      // setWagmiConfig(wagmiConfig);
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
