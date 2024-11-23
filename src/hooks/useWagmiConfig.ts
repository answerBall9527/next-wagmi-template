'use client';

import { useEffect, useState } from 'react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http, createConfig } from 'wagmi';
import { mainnet, bscTestnet, sepolia, base, arbitrum } from 'wagmi/chains';
import { tomoConnector } from '@/connectors/tomoConnector';
import { type Chain } from 'wagmi/chains';
import { injected, metaMask, safe, walletConnect } from 'wagmi/connectors'

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
    const chains = [mainnet, sepolia, bscTestnet, base, arbitrum] as const;
    
    // 转换为普通数组传递给 tomoConnector
    const chainArray: Chain[] = Array.from(chains);

    const connector = tomoConnector({
      chains: chainArray,
      options: {
        shimDisconnect: true,
      },
    });

    const tomoInjectedConnector = injected({
      target() { 
        return { 
          id: 'tomoInjectedProvider', 
          name: 'tomo Injected Provider', 
          provider: window.ethereum, 
        } 
      }, 
    })

    const config = createConfig({
      chains, // 这里使用只读数组
      // projectId,
      // metadata,
      ssr: true,
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
        [base.id]: http(),
        [arbitrum.id]: http(),
      },
      storage: createStorage({ storage: cookieStorage }),
      // enableWalletConnect: false,
      // enableInjected: true,
      // enableEIP6963: false,
      connectors: [connector, metaMask(), tomoInjectedConnector, walletConnect({
        projectId: '002c4d9f5a9cadecca899c835682d52b',
      }),],
    });
    console.log('config', config)
    setWagmiConfig(config);
  }, []);

  return wagmiConfig;
}
