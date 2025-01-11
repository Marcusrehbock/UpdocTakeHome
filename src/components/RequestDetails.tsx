// src/components/RequestDetails.tsx
import React, { useState } from 'react';
import { Request } from '../types';
import { Typography, Button, Grid, TextField, Box, CircularProgress, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import axios from 'axios';
import ConfirmDenyModal from './ConfirmDenyModal.tsx'; // Ensure correct import path

interface Props {
  request: Request;
  onConfirmSuccess: (message: string) => void;
  onRemoveRequest: (id: string) => void;
}

const RequestDetails: React.FC<Props> = ({ request, onConfirmSuccess, onRemoveRequest }) => {
  const [approvedDays, setApprovedDays] = useState<number>(request.how_many_days_are_you_requesting);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false); // State to control modal

  const handleConfirm = async () => {
    if (approvedDays < 1 || approvedDays > request.how_many_days_are_you_requesting) {
      setError(`Please enter a valid number of days (1 - ${request.how_many_days_are_you_requesting}).`);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('https://n8n.rehbock.xyz/webhook/confirm-request', {
        id: request.id,
        approvedDays: approvedDays,
        // Add any additional data if needed
      });

      if (response.status === 200) {
        setSuccess(true);
        onConfirmSuccess('Medical certificate confirmed and email sent.');
        onRemoveRequest(request.id);
      } else {
        setError('Failed to confirm medical certificate.');
      }
    } catch (error: any) {
      console.error(error);
      setError('Failed to confirm medical certificate.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to open the Deny modal
  const handleOpenDenyModal = () => {
    setModalOpen(true);
  };

  // Handler to close the Deny modal
  const handleCloseDenyModal = () => {
    setModalOpen(false);
  };

  // Handler when a request is denied
  const handleDenySuccess = (message: string) => {
    onConfirmSuccess(message); // Reuse success message handler
    onRemoveRequest(request.id);
    setModalOpen(false);
  };

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Request Details
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(request).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <Typography variant="subtitle2">{key.replace(/_/g, ' ')}:</Typography>
            <Typography variant="body1">{value !== null && value !== undefined ? value : 'N/A'}</Typography>
          </Grid>
        ))}
      </Grid>
      <Box mt={3}>
        <TextField
          label="Approved Days"
          type="number"
          value={approvedDays}
          onChange={(e) => setApprovedDays(Number(e.target.value))}
          fullWidth
          margin="normal"
          inputProps={{ min: 1, max: request.how_many_days_are_you_requesting }}
          helperText={`Enter between 1 and ${request.how_many_days_are_you_requesting} days`}
        />
        {error && (
          <Box mt={1}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
        <Box display="flex" alignItems="center" mt={2}>
          <Button variant="contained" color="primary" onClick={handleConfirm} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Confirm Medical Certificate'}
          </Button>
          {success && (
            <IconButton color="success" sx={{ ml: 2 }}>
              <CheckCircleIcon />
            </IconButton>
          )}
          {/* Deny Button */}
          <Button variant="outlined" color="error" onClick={handleOpenDenyModal} sx={{ ml: 2 }} disabled={loading}>
            Deny Request
          </Button>
        </Box>
      </Box>
      {/* Deny Modal */}
      <ConfirmDenyModal
        open={modalOpen}
        type="deny"
        onClose={handleCloseDenyModal}
        requestId={request.id}
        onDenySuccess={handleDenySuccess}
      />
    </div>
  );
};

export default RequestDetails;
