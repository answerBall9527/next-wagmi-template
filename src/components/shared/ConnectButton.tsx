'use client'

import React from 'react';
import { Connector, useConnect, useAccount } from 'wagmi'
import { disconnect } from 'wagmi/actions'
import { useWagmiConfig } from '@/context/WagmiConfig';

const ConnectButton = () => {
  const { connectors, connect } = useConnect()
  const wagmiConfig = useWagmiConfig();
  const { address, isConnected, connector } = useAccount();
  console.log('🔌 可用的 connectors:', connectors.map(c => ({
    id: c.id,
    name: c.name,
    type: c.type,
    uid: c.uid,
    ready: c.ready,
  })));

  const handleDisconnect = async () => {
    try {
      await disconnect(wagmiConfig)
      console.log('👋 已断开钱包连接')
    } catch (error) {
      console.error('断开连接时发生错误:', error)
    }
  }

  return (
    <div>
      <w3m-button />
      <div>{'isConnected: ' + isConnected}</div>
      <div>{'connector: ' + connector?.name}</div>

      {isConnected ? (
        <button 
          onClick={handleDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          断开连接
        </button>
      ) : (
        connectors.map((connector, i) => (
          <div key={connector.uid}>
            <button 
              onClick={() => {
                console.log('🚀 点击连接钱包', {
                  id: connector.id,
                  name: connector.name,
                  type: connector.type
                });
                connect({ connector });
              }}
            >
              #{i} {connector.name}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default ConnectButton;
