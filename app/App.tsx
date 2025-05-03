import React from 'react';
import ThirdPartyDApp from './Component/ThirdPartyDApp';
import Q3xMockDapp from './Component/Q3xMockDapp';

const App = () => {
  const baseUrl = 'http://localhost:3001/sdk-session';
	const address = '0x06A137cc8C1211c0df51AF440bf8F34208208801C06817204F1ff960A9fd4F1e';

  return (
    <div style={{ padding: '20px' }}>
      <h1>Q3x Connector SDK Test</h1>
      <div>
        <p>Address: {address}</p>
      </div>
      <p>----------------------------------------------</p>
      <ThirdPartyDApp baseUrl={baseUrl} address={address} />
      <p>----------------------------------------------</p>
      <Q3xMockDapp address={address} />
    </div>
  );
};

export default App; 