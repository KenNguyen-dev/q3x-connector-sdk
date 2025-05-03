import React from 'react';
import { useData } from '../hooks/useData';

interface DataViewerProps {
  endpoint: string;
}

export const DataViewer: React.FC<DataViewerProps> = ({ endpoint }) => {
  const { data, loading, error } = useData<any>(endpoint);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}; 