import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { Paper } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from './utils/FetchTransactions';

const Transactions = () => {
  const { data } = useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    staleTime: Infinity,
  });

  const [colDefs] = useState([
    { field: 'transactionAmount', flex: 1 },
    { field: 'dateOfTransaction', flex: 1 },
    { field: 'user name', flex: 1 },
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

export default Transactions;
