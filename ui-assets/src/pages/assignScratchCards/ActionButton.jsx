import React from 'react';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { assignModalAtom } from '../../store/userStore';

const ActionButton = () => {
  const [, setAssignModal] = useAtom(assignModalAtom);

  const data = null; // Replace with actual scratch card data when integrating

  const handleAssign = () => {
    setAssignModal({
      open: true,
      selectedScratchCard: data, // Pass the scratch card data
      selectedUser: null,
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="success"
        size="small"
        onClick={handleAssign}
      >
        Assign
      </Button>
    </div>
  );
};

export default ActionButton;
