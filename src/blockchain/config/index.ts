import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage, http } from 'wagmi';
import { mainnet, bscTestnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors'

export const projectId = 'a8a94eaa29bf7b1d3a0d94172c58e6ac';

if (!projectId) throw new Error('Project ID is not defined');

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const customInjectedConnector = (config: any) => ({
  id: 'tomowallet',
  name: 'TomoWallet Provider',
  type: 'custom',
  icon: '',
  supportsSimulation: true,

  async setup() {
    console.log('Setting up TomoWallet...');
  },

  async connect(parameters: any) {
    console.log('connect1')
    const accounts = await (window.ethereum as any).request({ method: 'eth_requestAccounts' });
    const chainId = await (window.ethereum as any).request({ method: 'eth_chainId' });
    return {
      accounts: accounts,
      chainId: parseInt(chainId),
    };
  },

  async disconnect() {
    console.log('Disconnected from TomoWallet');
  },

  async getAccounts() {
    const accounts = await (window.ethereum as any).request({ method: 'eth_accounts' });
    return accounts;
  },

  async getChainId() {
    const chainId = await (window.ethereum as any).request({ method: 'eth_chainId' });
    return parseInt(chainId);
  },

  async getProvider() {
    return window.ethereum;
  },

  async isAuthorized() {
    const accounts = await (window.ethereum as any).request({ method: 'eth_accounts' });
    return accounts.length > 0;
  },

  onAccountsChanged(accounts: string[]) {
    console.log('Accounts changed:', accounts);
  },

  onChainChanged(chainId: string) {
    console.log('Chain changed:', chainId);
  },

  onConnect(connectInfo: any) {
    console.log('Connected:', connectInfo);
  },

  onDisconnect(error: any) {
    console.error('Disconnected:', error);
  },

  onMessage(message: any) {
    console.log('Message received:', message);
  }
});

const customTomo1 = injected({ shimDisconnect: true, target() { 
  // 在客户端环境中，返回 `window.ethereum`
  if (typeof window !== 'undefined') {

    return {
      id: 'tomowallet',
      name: 'tomowallet Provider',
      provider: window.ethereum,
    }
  }
  // 在服务端环境中返回 `null`
  return undefined
}
})

export const wagmiConfig = defaultWagmiConfig({
  chains: [mainnet, sepolia, bscTestnet], // required
  projectId, // required
  metadata, // required
  ssr: true,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bscTestnet.id]: http('https://data-seed-prebsc-1-s1.binance.org:8545'),
  },
  storage: createStorage({
    storage: cookieStorage,
  }),
  enableWalletConnect: false, // Optional - true by default
  enableInjected: true, // Optional - true by default
  enableEIP6963: false, // Optional - true by default
  // enableEIP1193: true,
  // enableCoinbase: true, // Optional - true by default
  connectors: [customInjectedConnector, customTomo1],
});
