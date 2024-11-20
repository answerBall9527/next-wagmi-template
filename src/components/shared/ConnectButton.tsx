import React from 'react';
import { Connector, useConnect, useAccount } from 'wagmi'

const ConnectButton = () => {
  const { connectors, connect } = useConnect()
  const { address, isConnected } = useAccount();
  console.log('🔌 可用的 connectors:', connectors.map(c => ({
    id: c.id,
    name: c.name,
    type: c.type,
    uid: c.uid,
    ready: c.ready,
  })));

  return (
    <div>
      <w3m-button />
      {'isConnected: ' + isConnected}
      {connectors.map((connector, i) => (
        <button 
          key={connector.uid}
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
      ))}
    </div>
  );
};

export default ConnectButton;
