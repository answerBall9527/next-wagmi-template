'use client';

import { getNetwork } from '../networks/network';
import { Network } from '@/lib/types/network';
import { useChainId } from 'wagmi'

const useNetworkData = (): Network => {
  const chainId = useChainId();
  console.log('chainId1', chainId)
  const networkData = getNetwork(chainId);
  return networkData as Network;
};

export default useNetworkData;
