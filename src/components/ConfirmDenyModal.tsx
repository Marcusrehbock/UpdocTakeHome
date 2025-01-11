// src/components/ConfirmDenyModal.tsx
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { denyRequest } from '../services/api.ts';

interface Props {
  open: boolean;
  type: 'confirm' | 'deny';
  onClose: () => void;
  requestId: string;
  onDenySuccess: (message: string) => void;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ConfirmDenyModal: React.FC<Props> = ({ open, type, onClose, requestId, onDenySuccess }) => {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (type === 'deny' && input.trim() === '') {
      setError('Please provide a reason for denial.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      if (type === 'deny') {
        await denyRequest(requestId, input.trim());
        onDenySuccess('Request denied and email sent to the patient.');
      }
      // Future: Handle 'confirm' type if needed
    } catch (error) {
      console.error(error);
      setError('Failed to process the request.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setInput('');
      setError(null);
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="confirm-deny-modal" aria-describedby="confirm-deny-description">
      <Box sx={style}>
        <Typography id="confirm-deny-modal" variant="h6" component="h2" gutterBottom>
          {type === 'deny' ? 'Deny Request' : 'Confirm Request'}
        </Typography>
        {type === 'deny' && (
          <>
            <TextField
              label="Reason for Denial"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            {error && (
              <Box mt={2}>
                <Alert severity="error">{error}</Alert>
              </Box>
            )}
            <Box display="flex" justifyContent="flex-end" mt={2}>
              <Button onClick={handleClose} disabled={loading} sx={{ mr: 2 }}>
                Cancel
              </Button>
              <Button variant="contained" color="error" onClick={handleSubmit} disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Deny'}
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Modal>
  );
};

export default ConfirmDenyModal;
