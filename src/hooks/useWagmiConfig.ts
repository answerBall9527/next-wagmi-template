'use client';

import { useEffect, useState } from 'react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http } from 'wagmi';
import { mainnet, bscTestnet, sepolia, base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { TomoWalletTgSdkV2 } from '@tomo-inc/tomo-telegram-sdk';
import { type CreateConnectorFn } from 'wagmi';

export const projectId = 'a8a94eaa29bf7b1d3a0d94172c58e6ac';

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

export function useWagmiConfig() {
  const [wagmiConfig, setWagmiConfig] = useState<any>(null);

  useEffect(() => {
    // 检查是否在客户端环境
    if (typeof window === 'undefined') return;

    const customTomoConnector = injected({
      shimDisconnect: true,
      target() {
        if (typeof window !== 'undefined' && window.ethereum) {
          return {
            id: 'tomowallet',
            name: 'TomoWallet Provider',
            provider: window.ethereum,
          };
        }
        return undefined;
      },
    });

    const config = defaultWagmiConfig({
      chains: [mainnet, sepolia, bscTestnet, base],
      projectId,
      metadata,
      ssr: true, // 启用 SSR
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
      },
      storage: createStorage({ storage: cookieStorage }),
      enableWalletConnect: false,
      enableInjected: true,
      enableEIP6963: false,
      connectors: [customTomoConnector], // 只使用 customTomoConnector
    });

    setWagmiConfig(config);
  }, []);

  return wagmiConfig;
}
