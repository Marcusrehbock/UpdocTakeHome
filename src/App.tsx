// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Container, Grid, CircularProgress, Button, Box } from '@mui/material';
import { fetchRequests, fetchPendingRequests } from './services/api.ts';
import { Request } from './types.ts';
import RequestList from './components/RequestList.tsx';
import RequestDetails from './components/RequestDetails.tsx';

const App: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch to load all requests (optional)
  useEffect(() => {
    const loadAllRequests = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchRequests();
        setRequests(data);
        if (data.length > 0) setSelectedRequest(data[0]);
      } catch (error) {
        console.error(error);
        setError('Failed to load requests.');
      } finally {
        setLoading(false);
      }
    };
    loadAllRequests();
  }, []);

  // Handler to fetch pending requests
  const handleGetPendingRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPendingRequests();
      setRequests(data);
      if (data.length > 0) setSelectedRequest(data[0]);
      else setSelectedRequest(null);
    } catch (error) {
      console.error(error);
      setError('Failed to load pending requests.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to fetch all requests (optional, if you want to switch back)
  const handleGetAllRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRequests();
      setRequests(data);
      if (data.length > 0) setSelectedRequest(data[0]);
      else setSelectedRequest(null);
    } catch (error) {
      console.error(error);
      setError('Failed to load all requests.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" style={{ marginTop: '20px' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <h1>Updoc Doctors Portal</h1>
        <Button variant="contained" color="primary" onClick={handleGetPendingRequests}>
          Get Pending Requests
        </Button>
        {/* Optional: Button to fetch all requests */}
        {/* <Button variant="outlined" color="secondary" onClick={handleGetAllRequests}>
          Get All Requests
        </Button> */}
      </Box>
      {error && (
        <Box mb={2}>
          <p style={{ color: 'red' }}>{error}</p>
        </Box>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <RequestList requests={requests} onSelect={setSelectedRequest} />
        </Grid>
        <Grid item xs={12} md={9}>
          {selectedRequest ? (
            <RequestDetails request={selectedRequest} />
          ) : (
            <div>Select a request to view details.</div>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
