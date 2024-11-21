'use client';

import type { Abi } from 'viem';
import { useWagmiConfig } from '@/context/WagmiConfig';
import { tokenABI } from '../abis/token';
import useNetworkData from './useNetworkData';
import { handleError } from '@/lib/utils/errors';
import { useReadContract, useWriteContract } from 'wagmi';
import type { Config, UseReadContractParameters, UseWriteContractParameters } from 'wagmi';
import { useChainId } from 'wagmi';
import { useEffect, useMemo } from 'react';

type UseTokenReadParameters = Omit<UseReadContractParameters, 'abi' | 'address' | 'functionName' | 'args'>;

export function useTokenRead<T = unknown>(
  functionName: string,
  args: Array<any> = [],
  options?: UseTokenReadParameters,
) {
  const { token } = useNetworkData();
  return useReadContract<Abi, string, Array<any>, Config, T>({
    abi: tokenABI as Abi,
    address: token,
    functionName: functionName,
    args,
    query: {} as any,
    ...options,
  });
}

type useTokenWriteParameters = Pick<UseWriteContractParameters, 'mutation'>['mutation'];

export function useTokenWrite(functionName: string, options?: useTokenWriteParameters) {
  const { token } = useNetworkData();
  console.log('useTokenWirte', token)
  const wagmiConfig = useWagmiConfig();
  console.log('wagmiConfig', wagmiConfig)
  const { writeContractAsync, writeContract, ...rest } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onError: (error) => {
        handleError(error);
      },
      onSettled: (data) => {
        console.log(data);
      },
      ...options,
    },
  });

  const write = async (args: Array<any> = []) => {
    await writeContractAsync({
      abi: tokenABI as Abi,
      address: token,
      args,
      functionName,
    });
  };
  return { write, ...rest };
}

export function useToken(address?: string) {
  const wagmiConfig = useWagmiConfig();
  const chainId = useChainId(wagmiConfig as any);
  console.log('chainId in useToken', chainId)
  const tokenInfo = useMemo(() => {
    // 根据 chainId 和 address 获取对应的 token 信息
    return getTokenInfo(chainId, address);
  }, [chainId, address]);

  useEffect(() => {
    console.log('Token info updated for chain:', chainId);
  }, [chainId, tokenInfo]);

  return tokenInfo;
}

function getTokenInfo(chainId: number, address?: string) {
  // 实现根据 chainId 返回对应的 token 信息的逻辑
  // ...
}
