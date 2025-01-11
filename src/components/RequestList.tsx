// src/components/RequestList.tsx
import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import { Request } from '../types.ts';

interface Props {
  requests: Request[];
  onSelect: (request: Request) => void;
}

const RequestList: React.FC<Props> = ({ requests, onSelect }) => {
  return (
    <List>
      {requests.map((req) => (
        <ListItem key={req.id} disablePadding>
          <ListItemButton onClick={() => onSelect(req)}>
            <ListItemText
              primary={`${req.first_name} ${req.last_name}`}
              secondary={req.i_am_seeking}
            />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
};

export default RequestList;
