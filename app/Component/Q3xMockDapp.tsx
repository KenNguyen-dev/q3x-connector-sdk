import React, { useState, useEffect } from "react";
import { ConnectionState, SDKProvider, useSDK } from "../../src";
import { io, Socket } from "socket.io-client";

const Component = ({ address }: { address: string }) => {
  const { connectionState, verifyPairingCode } = useSDK();
  const [code, setCode] = useState<string>("");
  const [wsStatus, setWsStatus] = useState<string>("Disconnected");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [batchTransactions, setBatchTransactions] = useState<any[]>([]);

  useEffect(() => {
    // Cleanup socket on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleConnect = async () => {
    try {
      await verifyPairingCode(address, code);

      // Only connect to socket after successful verification
      const socketServerUrl = "http://localhost:3001";
      const newSocket = io(`${socketServerUrl}/sdk-session`, {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      // Connection opened
      newSocket.on("connect", () => {
        setWsStatus("Connected");
        // Send initial connection message
        newSocket.emit("joinRoom", address);
      });

      // Listen for messages
      newSocket.on("receive_batch_transaction", data => {
        setBatchTransactions(prev => [...prev, data]);
      });

      // Connection closed
      newSocket.on("disconnect", () => {
        setWsStatus("Disconnected");
      });

      setSocket(newSocket);
    } catch (error) {
      console.error("Verification failed:", error);
    }
  };

  return (
    <div>
      <h2>Q3x Mock Dapp</h2>
      <p>
        Status:
        {connectionState === ConnectionState.CONNECTED && <span> Connected ✅</span>}
        {connectionState === ConnectionState.CONNECTING && <span> Connecting...</span>}
        {connectionState === ConnectionState.DISCONNECTED && <span> Disconnected ❌</span>}
      </p>
      <p>Socket.IO: {wsStatus}</p>
      {connectionState === ConnectionState.CONNECTING ||
        (connectionState === ConnectionState.DISCONNECTED && (
          <>
            <input type="text" value={code} onChange={handleCodeChange} placeholder="Enter code" />
            <button onClick={handleConnect}>Connect</button>
          </>
        ))}
      {connectionState === ConnectionState.CONNECTED && (
        <div>
          <h3>Batch Transactions</h3>
          {batchTransactions.map((transaction, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p>To Address: {transaction.toAddress} | </p>
              <p>Amount: {transaction.amount} | </p>
              <p>Data: {transaction.data}</p>
            </div>
          ))}
        </div>
      )}
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
