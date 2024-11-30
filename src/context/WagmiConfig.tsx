'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { cookieStorage, createStorage, http, createConfig, Config } from 'wagmi';
import { mainnet, bscTestnet, sepolia, base, arbitrum, bsc } from 'wagmi/chains';
import { tomoConnector } from '@/connectors/tomoConnector';
import { type Chain } from 'wagmi/chains';
import { metaMask, walletConnect, injected } from 'wagmi/connectors';

const WagmiConfigContext = createContext<Config | null>(null);

export function WagmiConfigProvider({ children }: { children: ReactNode }) {
  const [wagmiConfig, setWagmiConfig] = useState<Config | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const chains = [mainnet, sepolia, bscTestnet, base, arbitrum, bsc] as const;
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
        chains,
        ssr: true,
        transports: {
          [mainnet.id]: http(),
          [sepolia.id]: http(),
          [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
          [base.id]: http(),
          [arbitrum.id]: http(),
          [bsc.id]: http(),
        },
        storage: createStorage({ 
          storage: cookieStorage,
          key: 'wagmi.wallet',
        }),
        connectors: [connector, metaMask(), walletConnect({
          projectId: '972c11857d9ca138663e5ca130e6fe63',
          relayUrl: 'wss://relay.walletconnect.com', 
          metadata: {
            name: 'pebbles',
            description: 'pebbles',
            url: 'https://next-wagmi-template.vercel.app/',
            icons: ['https://static.stakestone.io/btc/babylon.png'],
          },
        }), tomoInjectedConnector],
        syncConnectedChain: true,
      });

      setWagmiConfig(config);
    } catch (error) {
      console.error('Failed to initialize wagmi config:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return null;
  }

  return (
    <WagmiConfigContext.Provider value={wagmiConfig}>
      {wagmiConfig ? children : null}
    </WagmiConfigContext.Provider>
  );
}

export function useWagmiConfig() {
  const config = useContext(WagmiConfigContext);
  if (!config) {
    throw new Error('useWagmiConfig must be used within a WagmiConfigProvider');
  }
  return config;
} 