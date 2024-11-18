'use client';

import { useEffect, useState } from 'react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http } from 'wagmi';
import { mainnet, bscTestnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { TomoWalletTgSdkV2 } from '@tomo-inc/tomo-telegram-sdk';

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
    const customInjectedConnector = {
      id: 'tomowallet',
      name: 'TomoWallet Provider',
      type: 'custom',
      supportsSimulation: true,

      async setup() {
        new TomoWalletTgSdkV2({ injected: true });
        console.log('Setting up TomoWallet...');
      },

      async connect() {
        if (typeof window === 'undefined' || !window.ethereum) return {};
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        return {
          accounts,
          chainId: parseInt(chainId),
        };
      },

      async disconnect() {
        console.log('Disconnected from TomoWallet');
      },

      async getAccounts() {
        if (typeof window === 'undefined' || !window.ethereum) return [];
        return window.ethereum.request({ method: 'eth_accounts' });
      },

      async getChainId() {
        if (typeof window === 'undefined' || !window.ethereum) return null;
        return parseInt(await window.ethereum.request({ method: 'eth_chainId' }));
      },

      async getProvider() {
        return typeof window !== 'undefined' ? window.ethereum : null;
      },

      async isAuthorized() {
        if (typeof window === 'undefined' || !window.ethereum) return false;
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        return accounts.length > 0;
      },
    };

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
      chains: [mainnet, sepolia, bscTestnet],
      projectId,
      metadata,
      ssr: false,
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
      },
      storage: createStorage({ storage: cookieStorage }),
      enableWalletConnect: false,
      enableInjected: true,
      enableEIP6963: false,
      connectors: [customInjectedConnector, customTomoConnector],
    });

    setWagmiConfig(config);
  }, []);

  return wagmiConfig;
}
