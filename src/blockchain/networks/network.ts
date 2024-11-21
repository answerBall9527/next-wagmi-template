import type { Network, Networks } from '@/lib/types/network';

const networks: Networks = {
  97: {
    contract: '0x123410253',
    token: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
  },
  1: {
    contract: '0x123410253',
    token: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  }
};

export const getNetwork = (chainId?: number): Network => {
  if (chainId === undefined || !networks[chainId]) {
    return networks[97];
  }
  return networks[chainId];
};
