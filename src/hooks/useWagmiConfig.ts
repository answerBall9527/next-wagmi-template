'use client';

import { useEffect, useState } from 'react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http } from 'wagmi';
import { mainnet, bscTestnet, sepolia, base } from 'wagmi/chains';
import { tomoConnector } from '@/connectors/tomoConnector';
import { type Chain } from 'wagmi/chains';

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

    // 定义为只读数组类型
    const chains = [mainnet, sepolia, bscTestnet, base] as const;
    
    // 转换为普通数组传递给 tomoConnector
    const chainArray: Chain[] = Array.from(chains);

    const connector = tomoConnector({
      chains: chainArray,
      options: {
        shimDisconnect: true,
      },
    });

    const config = defaultWagmiConfig({
      chains, // 这里使用只读数组
      projectId,
      metadata,
      ssr: true,
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
        [base.id]: http(),
      },
      storage: createStorage({ storage: cookieStorage }),
      enableWalletConnect: false,
      enableInjected: true,
      enableEIP6963: false,
      connectors: [connector],
    });

    setWagmiConfig(config);
  }, []);

  return wagmiConfig;
}
