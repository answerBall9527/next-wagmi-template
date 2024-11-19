'use client';

import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import ConnectButton from '@/components/shared/ConnectButton';
import { useTokenRead, useTokenWrite } from '@/blockchain/hooks';
import useToast from '@/hooks/useToast';

export const dynamic = 'force-dynamic';

export default function Home() {
  const toast = useToast();
  const { address, isConnected } = useAccount();
  const [recipient, setRecipient] = useState('');
  const { connectors, connect } = useConnect()
  const tokenName = useTokenRead<string>('name');
  const tokenBalance = useTokenRead<bigint>('balanceOf', [address]);
  const tokenDecimals = useTokenRead<bigint>('decimals');
  const tokenSymbol = useTokenRead<string>('symbol');
  const [isTransferring, setIsTransferring] = useState(false);

  const tokenTransfer = useTokenWrite('transfer', {
    onSuccess(data) {
      console.log('data: transfer write ', data);
      toast('Transfer successful', 'success');
    },
    onError(error: Error) {
      console.error('Transfer error:', error);
      toast(error?.message || 'Transfer failed', 'error');
    },
  });

  const tokenNameData = tokenName.data;
  const tokenDecimalsData = Number(tokenDecimals.data);
  const tokenBalanceData = formatUnits(tokenBalance.data || BigInt(0), tokenDecimalsData);
  const tokenSymbolData = tokenSymbol.data as string;
  const handleTransfer = async () => {
    if (!isConnected) {
      toast('Please connect your wallet first', 'error');
      return;
    }
    
    if (!recipient) {
      toast('Please enter recipient address', 'error');
      return;
    }

    try {
      setIsTransferring(true);
      const amount = parseUnits('10', tokenDecimalsData);
      await tokenTransfer.write([recipient, amount]);
    } catch (error: any) {
      console.error('Transfer error:', error);
      toast(error?.message || 'Transfer failed', 'error');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <main className="h-screen w-full flex justify-center items-center bg-black text-white">
      <div className="flex flex-col gap-5 items-center">
        <ConnectButton />

        {address ? (
          <div className="">
            <p>
              Token Balance: <span className="text-green-500 font-bold">{tokenBalanceData}</span>
            </p>
            <p>
              Token Name: <span className="text-green-500 font-bold">{tokenNameData}</span>
            </p>
            <p>
              Token Decimals: <span className="text-green-500 font-bold">{tokenDecimalsData} </span>
            </p>
            <p>
              Token Symbol: <span className="text-green-500 font-bold">{tokenSymbolData}</span>
            </p>
          </div>
        ) : (
          <p className="text-red-500">Connect Your Wallet1</p>
        )}

        <div className="flex gap-5">
          <input
            type="text"
            placeholder="Enter recipient address"
            className="p-2 border-none rounded-md focus:outline-cyan-300 text-black"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={!isConnected}
          />
          <button 
            className={`border-cyan-700 border-2 rounded-md px-3 py-1 ${
              (!isConnected || isTransferring) ? 'opacity-50 cursor-not-allowed' : ''
            }`} 
            onClick={handleTransfer}
            disabled={!isConnected || isTransferring}
          >
            {isTransferring ? 'Transferring...' : 'Transfer'}
          </button>
        </div>
      </div>
    </main>
  );
}
