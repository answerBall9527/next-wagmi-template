import type { Network, Networks } from '@/lib/types/network';

const networks: Networks = {
  97: {
    contract: '0x123410253',
    token: '0xFa60D973F7642B748046464e165A65B7323b0DEE',
  },
  1: {
    contract: '0x123410253',
    token: '0x094c0e36210634c3CfA25DC11B96b562E0b07624',
  },
  56: {
    contract: '0x123410253',
    token: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
  }
};

export const getNetwork = (chainId?: number): Network => {
  if (chainId === undefined || !networks[chainId]) {
    return networks[97];
  }
  return networks[chainId];
};
