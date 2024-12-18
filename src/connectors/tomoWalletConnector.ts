import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, createConnector, useAccount, useChainId, useConnect, useConnections, useConnectors, useDisconnect, useSignMessage } from 'wagmi';
import { arbitrum, base, Chain, mainnet, optimism, polygon } from 'viem/chains';
import { EIP1193Provider } from 'viem/_types/types/eip1193';
import { injected } from 'wagmi/connectors';
import { EthereumProvider } from '@tomo-inc/tomo-telegram-sdk/dist/tomoEvmProvider.esm'
import styles from '../../styles/Home.module.css';

const logoUrl = "https://d13t1x9bdoguib.cloudfront.net/static/tomo.svg"

export const tomoWalletConnector = createConnector((config) => {
    const ethereum = new EthereumProvider({
      metaData: {
        icon: 'your icon url',
        name: 'your dapp name'
      }
    })
    return {
      ...injected(
        {
          shimDisconnect: false,
          target: () => ({
            id: "tomoWallet",
            name: "TOMO Wallet",
            icon: logoUrl,
            provider: ethereum as EIP1193Provider,
          })
        }
      )(config)
    }
  })
  