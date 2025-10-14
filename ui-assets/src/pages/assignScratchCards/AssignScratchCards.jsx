import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchScratchCards } from './utils/assignScratchCards';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { Paper } from '@mui/material';
import ActionButton from './actionButton';
import { Box } from '@mui/system';

const AssignScratchCards = () => {
  const { data } = useQuery({
    queryKey: ['scratchCards'],
    queryFn: fetchScratchCards,
    staleTime: Infinity,
  });

  const [colDefs] = useState([
    { field: 'Amount' },
    { field: 'expiryDate', flex: 1 },
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
          <h2>Assign Scratch Cards</h2>
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
    </>
  );
};

export default AssignScratchCards;
