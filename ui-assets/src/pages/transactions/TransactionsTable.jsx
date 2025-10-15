import React from 'react';
import { AgGridReact } from 'ag-grid-react';
import { useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { useQuery } from '@tanstack/react-query';
import { fetchTransactions } from './utils/FetchTransactions';
import TransactionsButtons from './TransactionsButtons';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import { transactionDialogAtom } from '../../store/userStore';

export const TransactionsTable = () => {
  const [transactionDialogState] = useAtom(transactionDialogAtom);

  const { dateOfTransaction, userId, transactionAmount } =
    transactionDialogState;

  const { data } = useQuery({
    queryKey: ['transactions'],
    queryFn: () =>
      fetchTransactions(dateOfTransaction, userId, transactionAmount),
    staleTime: Infinity,
  });

  const [colDefs] = useState([
    { field: 'transactionAmount', flex: 1 },
    {
      field: 'dateOfTransaction',
      flex: 1,
      valueFormatter: (params) => dayjs(params.value).format('DD MMMM YYYY'),
    },
    { field: 'fullName', flex: 1, headerName: 'User Name' },
  ]);
  return (
    <>
      <Paper elevation={3} sx={{ margin: 5, padding: 3 }}>
        <Typography variant="h4" color="initial">
          Transactions
        </Typography>
        <TransactionsButtons />
        <Box
          px={3}
          py={2}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <h2>Transaction History</h2>
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

export default TransactionsTable;
