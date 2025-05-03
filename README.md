# Q3X Connector React SDK

React SDK for interacting with the Q3X Connector API.

## Installation

```bash
npm install q3x-connector-sdk
```

## Usage

```tsx
import { SDKProvider, DataViewer } from 'q3x-connector-sdk';

function App() {
  return (
    <SDKProvider config={{ apiKey: 'your-api-key' }}>
      <DataViewer endpoint="/api/data" />
    </SDKProvider>
  );
}
```

## Hooks

```tsx
import { useData } from 'q3x-connector-sdk';

function MyComponent() {
  const { data, loading, error } = useData('/api/data');
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Test
npm test

# Lint
npm run lint

# Format
npm run format
```

## License

MIT 