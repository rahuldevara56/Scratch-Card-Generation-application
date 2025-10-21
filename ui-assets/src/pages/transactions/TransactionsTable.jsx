import React from "react";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import { Paper } from "@mui/material";
import { Box } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import {
  fetchFilteredTransactions,
  fetchTransactions,
} from "./utils/FetchTransactions";
import TransactionsButtons from "./TransactionsButtons";
import dayjs from "dayjs";
import { useAtom } from "jotai";
import { transactionDialogAtom } from "../../store/common.store";

export const TransactionsTable = () => {
  const [transactionDialogState] = useAtom(transactionDialogAtom);

  const { dateOfTransaction, userId, transactionAmount } =
    transactionDialogState;

  const hasFilters = dateOfTransaction || userId || transactionAmount;

  const { data } = useQuery({
    queryKey: hasFilters
      ? ["transactions", dateOfTransaction, userId, transactionAmount]
      : ["transactions"],
    queryFn: () =>
      hasFilters
        ? fetchFilteredTransactions(
            dateOfTransaction,
            userId,
            transactionAmount
          )
        : fetchTransactions(),
    staleTime: Infinity,
  });

  const [colDefs] = useState([
    { field: "transactionAmount", flex: 1 },
    {
      field: "dateOfTransaction",
      flex: 1,
      valueFormatter: (params) => dayjs(params.value).format("DD MMMM YYYY"),
    },
    { field: "fullName", flex: 1, headerName: "User Name" },
  ]);
  return (
    <>
      <Paper elevation={3} sx={{ margin: 5, padding: 3 }}>
        <h1>Transactions</h1>
        <TransactionsButtons />
        <Box
          px={3}
          py={2}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <h1>Transaction History</h1>
          <div
            className="ag-theme-alpine"
            style={{ height: 400, width: "100%" }}
          >
            <AgGridReact
              rowData={data || []}
              columnDefs={colDefs}
              defaultColDef={{
                sortable: true,
                filter: true,
                floatingFilter: true,
                resizable: true,
              }}
            />
          </div>
        </Box>
      </Paper>
    </>
  );
};

export default TransactionsTable;
