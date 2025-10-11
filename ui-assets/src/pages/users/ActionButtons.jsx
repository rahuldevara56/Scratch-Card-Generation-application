import React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ActionButtons = () => {
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <IconButton aria-label="edit" color="primary">
        <EditIcon />
      </IconButton>
      <IconButton aria-label="delete" color="error">
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default ActionButtons;
