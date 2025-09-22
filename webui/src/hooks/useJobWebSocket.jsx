import { useState, useEffect, useRef } from 'react';

const useJobWebSocket = (jobId, token) => {
  const [jobData, setJobData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!jobId || !token) return;

    const connect = () => {
      // In a real implementation, this would connect to the backend WebSocket
      // For now, we'll simulate WebSocket behavior
      setIsConnected(true);
      
      // Simulate receiving job updates
      const interval = setInterval(() => {
        // This is just for demonstration - in a real app, we'd receive actual data from the WebSocket
        const mockData = {
          event: 'progress',
          progress: Math.min(100, Math.floor(Math.random() * 20) + (jobData?.progress || 0)),
          status: 'downloading'
        };
        setJobData(mockData);
      }, 2000);

      return () => clearInterval(interval);
    };

    const connection = connect();

    return () => {
      if (connection) {
        connection.close();
      }
      setIsConnected(false);
    };
  }, [jobId, token, jobData?.progress]);

  return { jobData, isConnected, error };
};

export default useJobWebSocket;