export interface Q3xConnectorConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

export interface APIResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface Q3xConnectorError {
  message: string;
  code: string;
}

export interface Call {
  contractAddress: string;
  entrypoint: string;
  calldata: string[];
}

export enum ConnectionState {
  CONNECTED = 'CONNECTED',
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED',
}

export interface Connection {
  isConnected: boolean;
  isConnecting: boolean;
  isDisconnected: boolean;
  pairingResponse?: PairingResponse;
}

export interface SDKConfig {
  baseUrl: string;
  apiKey?: string;
}

export interface PairingResponse {
  code: string;
  expiresAt: number;
}

export interface Session {
  createdAt: number;
  code: string;
  expiresAt: number;
  connectedAt?: number;
}
