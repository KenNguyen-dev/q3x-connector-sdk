import React, { useState } from 'react';
import { ConnectionState, SDKProvider, useSDK } from '../../src';

const Component = ({ address }: { address: string }) => {
	const { connectionState, verifyPairingCode } = useSDK();
	const [code, setCode] = useState<string>('');

	const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCode(e.target.value);
	};

	const handleConnect = () => {
		verifyPairingCode(address, code);
	};
	
  return (
    <div>
      <h2>Q3x Mock Dapp</h2>
				<p>Status:  
          {connectionState === ConnectionState.CONNECTED && <span> Connected ✅</span>}
          {connectionState === ConnectionState.CONNECTING && <span> Connecting...</span>}
          {connectionState === ConnectionState.DISCONNECTED && <span> Disconnected ❌</span>}
        </p>
				<input type="text" value={code} onChange={handleCodeChange} placeholder="Enter code" />
				<button onClick={handleConnect}>Connect</button>
    </div>
  );
};


export const Q3xMockDapp = ({ address }: { address: string }) => {
	return (
		<SDKProvider>
			<Component address={address} />
		</SDKProvider>
	);
};

export default Q3xMockDapp;