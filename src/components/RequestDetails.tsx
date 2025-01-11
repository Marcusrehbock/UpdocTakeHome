// src/components/RequestDetails.tsx
import React, { useState } from 'react';
import { Request } from '../types.ts';
import { Typography, Button, Grid } from '@mui/material';
import ConfirmDenyModal from './ConfirmDenyModal.tsx';

interface Props {
  request: Request;
}

const RequestDetails: React.FC<Props> = ({ request }) => {
  const [modalOpen, setModalOpen] = useState<null | 'confirm' | 'deny'>(null);

  return (
    <div>
      <Typography variant="h6">Request Details</Typography>
      <Grid container spacing={2}>
        {Object.entries(request).map(([key, value]) => (
          <Grid item xs={12} sm={6} key={key}>
            <Typography variant="subtitle2">{key.replace(/_/g, ' ')}:</Typography>
            <Typography variant="body1">{value || 'N/A'}</Typography>
          </Grid>
        ))}
      </Grid>
      <div style={{ marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => setModalOpen('confirm')} style={{ marginRight: '10px' }}>
          Confirm
        </Button>
        <Button variant="outlined" color="secondary" onClick={() => setModalOpen('deny')}>
          Deny
        </Button>
      </div>
      {modalOpen && (
        <ConfirmDenyModal
          open={Boolean(modalOpen)}
          type={modalOpen}
          onClose={() => setModalOpen(null)}
          requestId={request.id}
        />
      )}
    </div>
  );
};

export default RequestDetails;
