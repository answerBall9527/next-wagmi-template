import React from 'react';
import { Connector, useConnect } from 'wagmi'

const ConnectButton = () => {
  const { connectors, connect } = useConnect()
  console.log('connectors', connectors)
  return (
    <div>
      <w3m-button />
      {connectors.map((connector, i) => (
        <button key={connector.uid} onClick={() => connect({ connector })}>
          #{i} {connector.name}
        </button>
      ))}
    </div>
  );
};

export default ConnectButton;
