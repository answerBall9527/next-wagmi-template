'use client';

import { useState } from 'react';
import { useAccount, useConnect } from 'wagmi';
import { formatUnits, parseUnits } from 'viem';
import ConnectButton from '@/components/shared/ConnectButton';
import { useTokenRead, useTokenWrite } from '@/blockchain/hooks';
import useToast from '@/hooks/useToast';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function Home() {
  const router = useRouter();
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
      const message = 'Transfer successful';
      console.log('Toast message:', message);
      toast(message, 'success');
    },
    onError(error: Error) {
      console.error('Transfer error:', error);
      const message = error?.message || 'Transfer failed';
      console.log('Toast error message1:', message);
      toast(message, 'error');
    },
  });

  const tokenNameData = tokenName.data;
  const tokenDecimalsData = Number(tokenDecimals.data);
  const tokenBalanceData = formatUnits(tokenBalance.data || BigInt(0), tokenDecimalsData);
  const tokenSymbolData = tokenSymbol.data as string;
  const handleTransfer = async () => {
    if (!isConnected) {
      const message = 'Please connect your wallet first';
      console.log('Toast message:', message);
      toast(message, 'error');
      return;
    }
    
    if (!recipient) {
      const message = 'Please enter recipient address';
      console.log('Toast message:', message);
      toast(message, 'error');
      return;
    }

    try {
      setIsTransferring(true);
      const amount = parseUnits('10', tokenDecimalsData);
      await tokenTransfer.write([recipient, amount]);
    } catch (error: any) {
      console.error('Transfer error:', error);
      const message = error?.message || 'Transfer failed';
      console.log('Toast error message2:', message);
      toast(message, 'error');
    } finally {
      setIsTransferring(false);
    }
  };

  return (
    <main className="min-h-screen w-full flex justify-center items-center bg-white text-white">
      <div className="flex flex-col gap-5 items-center">
        <button 
          onClick={() => router.push('/home')}
          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg shadow-lg transition-colors duration-200 flex items-center space-x-2"
        >
          <span>Go to Home</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>

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
