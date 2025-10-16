import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchScratchCards } from './utils/assignScratchCards';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import {
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import ActionButton from './ActionButton';
import { Box } from '@mui/system';
import { useAtom } from 'jotai';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import toast from 'react-hot-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { assignScratchCard, fetchUsers } from './utils/assignScratchCards';
import { assignModalAtom } from '../../store/userStore';
import dayjs from 'dayjs';

const AssignScratchCards = () => {
  const { data } = useQuery({
    queryKey: ['scratchCards'],
    queryFn: fetchScratchCards,
    staleTime: Infinity,
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const [assignModal, setAssignModal] = useAtom(assignModalAtom);
  const queryClient = useQueryClient();

  const assignMutation = useMutation({
    mutationFn: assignScratchCard,
    onSuccess: () => {
      queryClient.invalidateQueries(['scratchCards']);
      toast.success('Scratch card assigned successfully');
      setAssignModal({
        open: false,
        selectedScratchCard: null,
        selectedUser: null,
      });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to assign');
    },
  });

  const handleAssign = () => {
    if (assignModal.selectedUser && assignModal.selectedScratchCard) {
      assignMutation.mutate({
        scratchCardId: assignModal.selectedScratchCard.id,
        userId: assignModal.selectedUser.id,
      });
    }
  };

  const [colDefs] = useState([
    { field: 'Amount' },
    {
      field: 'expiryDate',
      flex: 1,
      valueFormatter: (params) => dayjs(params.value).format('DD MMMM YYYY'),
    },
    { field: 'isActive' },
    {
      colId: 'actions',
      cellRenderer: ActionButton,
      headerName: 'Actions',
      width: 150,
      flex: 1,
    },
  ]);

  return (
    <>
      <Paper elevation={3} sx={{ margin: 5, padding: 3 }}>
        <Box
          px={3}
          py={2}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <h1>Assign ScratchCards</h1>
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: '100%' }}
          >
            <AgGridReact
              rowData={data || []}
              columnDefs={colDefs}
              rowSelection="multiple"
            />
          </div>
        </Box>
      </Paper>

      <Dialog
        open={assignModal.open}
        onClose={() => setAssignModal({ ...assignModal, open: false })}
      >
        <DialogTitle>Assign Scratch Card</DialogTitle>
        <DialogContent sx={{ minWidth: 400, minHeight: 150 }}>
          <Autocomplete
            disablePortal
            options={users || []}
            getOptionLabel={(option) =>
              `${option.firstName} ${option.lastName}`
            } // Display full name
            sx={{ width: 300, mt: 2 }}
            value={assignModal.selectedUser}
            onChange={(event, newValue) =>
              setAssignModal({ ...assignModal, selectedUser: newValue })
            }
            renderInput={(params) => (
              <TextField {...params} label="Select User" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setAssignModal({ ...assignModal, open: false })}
          >
            Cancel
          </Button>
          <Button onClick={handleAssign} disabled={assignMutation.isPending}>
            {assignMutation.isPending ? 'Assigning...' : 'Assign'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AssignScratchCards;
