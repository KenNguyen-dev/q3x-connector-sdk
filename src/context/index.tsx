import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { SDKConfig, ConnectionState, Call, PairingResponse, Session, Transaction } from "../types";
import { config } from "process";

interface SDKContextType {
  connectionState: ConnectionState;
  generatePairingCode: (address: string) => Promise<void>;
  pairingResponse?: PairingResponse;
  verifyPairingCode: (address: string, code: string) => Promise<void>;
  addToQ3xBatch: (transaction: Transaction) => Promise<void>;
}

const SDKContext = createContext<SDKContextType | null>(null);

export const useSDK = () => {
  const context = useContext(SDKContext);
  if (!context) {
    throw new Error("useSDK must be used within SDKProvider");
  }
  return context;
};

export const SDKProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SDKConfig>({
    baseUrl: "http://localhost:3001/sdk-session",
  });
  const [pairingResponse, setPairingResponse] = useState<PairingResponse>();
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);

  const generatePairingCode = async (address: string) => {
    const response = await fetch(`${config.baseUrl}/generate-pairing-code?address=${address}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("Failed to generate pairing code");

    const data: PairingResponse = await response.json();
    setPairingResponse(data);

    setConnectionState(ConnectionState.CONNECTING);

    startPolling(address);
  };

  const verifyPairingCode = async (address: string, code: string) => {
    const response = await fetch(`${config.baseUrl}/verify-pairing-code?code=${code}`);
    const data: Session = await response.json();

    if (data.connectedAt) {
      setConnectionState(ConnectionState.CONNECTED);
    }
  };

  const addToQ3xBatch = async (transaction: Transaction) => {
    const response = await fetch(`${config.baseUrl}/add-to-batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        toAddress: transaction.toAddress,
        amount: transaction.amount,
        data: transaction.data,
      }),
    });

    if (!response.ok) throw new Error("Failed to add to Q3x batch");

    console.log("Transaction added to Q3x batch");
  };

  const startPolling = (address: string) => {
    const poll = async () => {
      try {
        const response = await fetch(`${config.baseUrl}/status?address=${address}`);
        const text = await response.text();

        if (!response.ok) {
          console.error("Status check failed:", text);
          return;
        }

        if (!text) {
          console.error("Empty response from status check");
          return;
        }

        const data: Session = JSON.parse(text);
        if (data.connectedAt) {
          setConnectionState(ConnectionState.CONNECTED);
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    };

    const interval = setInterval(poll, 5000);
    return () => clearInterval(interval);
  };

  useEffect(() => {
    if (pairingResponse?.code) {
      const cleanup = startPolling(pairingResponse.code);
      return cleanup;
    }
  }, [pairingResponse?.code]);

  const value = useMemo(
    () => ({
      connectionState,
      generatePairingCode,
      pairingResponse,
      verifyPairingCode,
      addToQ3xBatch,
    }),
    [connectionState, generatePairingCode, pairingResponse, verifyPairingCode, addToQ3xBatch],
  );

  return <SDKContext.Provider value={value}>{children}</SDKContext.Provider>;
};
