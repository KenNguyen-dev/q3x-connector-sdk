import React, { useState } from "react";
import { ConnectionState, SDKProvider, useSDK } from "../../src";

// Test component to demonstrate SDK usage
export const Component = ({ baseUrl, address }: { baseUrl: string; address: string }) => {
  const [toAddress, setToAddress] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [data, setData] = useState<string>("");

  const { connectionState, pairingResponse, generatePairingCode, addToQ3xBatch } = useSDK();

  return (
    <div>
      <h2>Third-party DApp</h2>
      <div>
        <p>
          Status:
          {connectionState === ConnectionState.CONNECTED && <span> Connected ✅</span>}
          {connectionState === ConnectionState.CONNECTING && <span> Connecting...</span>}
          {connectionState === ConnectionState.DISCONNECTED && <span> Disconnected ❌</span>}
        </p>

        {pairingResponse ? (
          <p>Pairing Code: {pairingResponse.code}</p>
        ) : (
          <button onClick={() => generatePairingCode(address)}>Generate Pairing Code</button>
        )}
        <div>
          <input type="text" value={toAddress} onChange={e => setToAddress(e.target.value)} placeholder="To Address" />
          <input type="text" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" />
          <input type="text" value={data} onChange={e => setData(e.target.value)} placeholder="Data" />
        </div>
        <div>
          <button onClick={() => addToQ3xBatch({ toAddress, amount, data })}>Add to Q3x batch</button>
        </div>
      </div>
    </div>
  );
};

// Test setup example
export const ThirdPartyDApp = ({ baseUrl, address }: { baseUrl: string; address: string }) => {
  return (
    <SDKProvider>
      <Component baseUrl={baseUrl} address={address} />
    </SDKProvider>
  );
};

export default ThirdPartyDApp;
