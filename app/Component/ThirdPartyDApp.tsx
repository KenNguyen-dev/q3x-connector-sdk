import React from 'react';
import { ConnectionState, SDKProvider, useSDK } from '../../src';

// Test component to demonstrate SDK usage
export const Component = ({ baseUrl, address }: { baseUrl: string, address: string }) => {
  const { 
    connectionState,
    pairingResponse,
		generatePairingCode
  } = useSDK();

  return (
    <div>
			<h2>Third-party DApp</h2>
      <div>
        <p>Status:  
          {connectionState === ConnectionState.CONNECTED && <span> Connected ✅</span>}
          {connectionState === ConnectionState.CONNECTING && <span> Connecting...</span>}
          {connectionState === ConnectionState.DISCONNECTED && <span> Disconnected ❌</span>}
        </p>
       
        {pairingResponse && <p>Pairing Code: {pairingResponse.code}</p>}
      </div>
			<div>
				<button onClick={() => generatePairingCode(address)}>Generate Pairing Code</button>
			</div>
      {/* <div>
        {!isConnected && !isConnecting && (
          <button onClick={handleConnect}>Connect</button>
        )}
        {isConnected && (
          <>
            <button onClick={handleExecute}>Execute Transaction</button>
            <button onClick={disconnect}>Disconnect</button>
          </>
        )}
      </div> */}
    </div>
  );
};

// Test setup example
export const ThirdPartyDApp = ({ baseUrl, address }: { baseUrl: string, address: string }) => {
  return (
    <SDKProvider>
      <Component baseUrl={baseUrl} address={address} />
    </SDKProvider>
  );
};

export default ThirdPartyDApp;