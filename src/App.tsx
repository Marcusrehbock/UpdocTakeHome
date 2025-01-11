// src/App.tsx
import React, { useEffect, useState } from 'react';
import { Container, Grid, CircularProgress, Button, Box, Snackbar, Alert, Typography } from '@mui/material';
import { fetchRequests, fetchPendingRequests } from './services/api.ts';
import { Request } from './types.ts';
import RequestList from './components/RequestList.tsx';
import RequestDetails from './components/RequestDetails.tsx';

const App: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

  // Handler to remove a request from the list after confirmation or denial
  const handleRemoveRequest = (id: string) => {
    setRequests((prevRequests) => prevRequests.filter((req) => req.id !== id));
    setSelectedRequest((prevSelected) => {
      if (prevSelected && prevSelected.id === id) {
        return null;
      }
      return prevSelected;
    });
  };

  // Handler to show success message
  const handleShowSuccess = (message: string) => {
    setSuccessMessage(message);
  };

  // Handler to close success message
  const handleCloseSuccess = () => {
    setSuccessMessage(null);
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
        <Typography variant="h4" component="h1" gutterBottom>
          Updoc Doctors Portal
        </Typography>
        <Button variant="contained" color="primary" onClick={handleGetPendingRequests} sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}>
          Get Pending Requests
        </Button>
        {/* Optional: Button to fetch all requests */}
        {/* <Button variant="outlined" color="secondary" onClick={handleGetAllRequests}>
          Get All Requests
        </Button> */}
      </Box>
      {error && (
        <Box mb={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}
      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          {requests.length > 0 ? (
            <RequestList requests={requests} onSelect={setSelectedRequest} />
          ) : (
            <Typography variant="body1">No pending requests available.</Typography>
          )}
        </Grid>
        <Grid item xs={12} md={9}>
          {selectedRequest ? (
            <RequestDetails
              request={selectedRequest}
              onConfirmSuccess={handleShowSuccess}
              onRemoveRequest={handleRemoveRequest}
            />
          ) : (
            <Typography variant="body1">Select a request to view details.</Typography>
          )}
        </Grid>
      </Grid>
      {/* Success Snackbar */}
      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={6000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSuccess} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default App;
