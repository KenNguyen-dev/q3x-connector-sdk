import { useState, useEffect } from 'react';
import { useSDK } from '../context';
import { APIResponse, SDKError } from '../types';

export const useData = <T>(endpoint: string) => {
  const { config } = useSDK();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<SDKError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.baseUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`
          }
        });
        
        const result: APIResponse<T> = await response.json();
        setData(result.data);
      } catch (err) {
        setError({
          message: 'Failed to fetch data',
          code: 'FETCH_ERROR'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint, config]);

  return { data, loading, error };
}; 