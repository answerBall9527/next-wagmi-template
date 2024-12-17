
'use client'

import React from 'react';
import { Connector, useConnect, useAccount } from 'wagmi'

const ConnectButton = () => {
  const { connectors, connect } = useConnect()
  const { address, isConnected, connector } = useAccount();
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
      <div>{'isConnected: ' + isConnected}</div>
      <div>{'connector: ' + connector}</div>
      {connectors.map((connector, i) => (
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
      ))}
    </div>
  );
};

export default ConnectButton;
