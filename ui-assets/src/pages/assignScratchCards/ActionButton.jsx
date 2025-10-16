import React from 'react';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { assignModalAtom } from '../../store/userStore';

const ActionButton = (params) => {
  const [, setAssignModal] = useAtom(assignModalAtom);

  const handleAssign = () => {
    setAssignModal({
      open: true,
      selectedScratchCard: params.data,
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
