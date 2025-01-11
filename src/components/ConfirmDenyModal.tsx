// src/components/ConfirmDenyModal.tsx
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';
import { confirmRequest, denyRequest } from '../services/api.ts';

interface Props {
  open: boolean;
  type: 'confirm' | 'deny';
  onClose: () => void;
  requestId: string;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const ConfirmDenyModal: React.FC<Props> = ({ open, type, onClose, requestId }) => {
  const [input, setInput] = useState('');

  const handleSubmit = async () => {
    try {
      if (type === 'confirm') {
        const days = parseInt(input, 10);
        await confirmRequest(requestId, days);
        // Optionally, trigger PDF generation and email sending via n8n
      } else {
        await denyRequest(requestId, input);
      }
      onClose();
      // Optionally, refresh the requests list
    } catch (error) {
      console.error(error);
      // Handle error (e.g., show notification)
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          {type === 'confirm' ? 'Confirm Request' : 'Deny Request'}
        </Typography>
        <TextField
          fullWidth
          label={type === 'confirm' ? 'Number of Days' : 'Reason for Denial'}
          variant="outlined"
          margin="normal"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Modal>
  );
};

export default ConfirmDenyModal;
