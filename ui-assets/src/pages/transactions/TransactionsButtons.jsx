import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/system';
import { useAtom } from 'jotai';
import { transactionDialogAtom } from '../../store/userStore';
import MakeTransaction from './MakeTransaction';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../assignScratchCards/utils/assignScratchCards';
import Autocomplete from '@mui/material/Autocomplete';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  transactionAmount: yup
    .number()
    .min(1, 'Amount must be positive')
    .required('Amount is required'),
  transactionDate: yup.date().required('Date is required'),
  user: yup.object().required('User is required'),
});

const TransactionsButtons = () => {
  const [transactionDialogState, setTransactionDialogState] = useAtom(
    transactionDialogAtom
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      transactionAmount: '',
      transactionDate: null,
      user: null,
    },
    resolver: yupResolver(schema),
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const handleClickOpen = () => {
    setTransactionDialogState({
      ...transactionDialogState,
      open: true,
    });
  };

  const handleClose = () => {
    setTransactionDialogState({
      ...transactionDialogState,
      open: false,
    });
  };

  const onSubmit = (data) => {
    setTransactionDialogState({
      ...transactionDialogState,
      dateOfTransaction: data.transactionDate
        ? data.transactionDate.toISOString()
        : null,
      userId: data.user ? data.user.id : null,
      transactionAmount: data.transactionAmount || null,
    });
  };

  return (
    <div>
      <>
        <Box px={3} py={4}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            sx={{
              display: 'flex',
              gap: 2,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
            }}
          >
            <Controller
              name="user"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  disablePortal
                  options={users || []}
                  getOptionLabel={(option) =>
                    `${option.firstName} ${option.lastName}`
                  } // Display full name
                  sx={{ width: 300, mt: 2 }}
                  error={!!errors.user}
                  helperText={errors.user ? errors.user.message : ''}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  renderInput={(params) => (
                    <TextField {...params} label="Select User" />
                  )}
                />
              )}
            />

            <Controller
              name="transactionAmount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  required
                  id="outlined-required"
                  label="Transaction Amount"
                  type="number"
                  placeholder="transactionAmount"
                  sx={{ width: '100%', maxWidth: 250, height: 48 }}
                  error={!!errors.transactionAmount}
                  helperText={
                    errors.transactionAmount
                      ? errors.transactionAmount.message
                      : ''
                  }
                  inputProps={{ min: 1 }}
                />
              )}
            />

            <Controller
              name="transactionDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={['DatePicker']}>
                    <DatePicker
                      {...field}
                      label="Transaction Date"
                      sx={{ width: '100%' }}
                      error={!!errors.transactionDate}
                      helperText={
                        errors.transactionDate
                          ? errors.transactionDate.message
                          : ''
                      }
                    />
                  </DemoContainer>
                </LocalizationProvider>
              )}
            />

            <Button
              variant="contained"
              color="success"
              sx={{
                height: 50,
                width: 48,
                minWidth: 48,
                padding: 0,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 1,
              }}
              type="submit"
            >
              <SearchIcon />
            </Button>

            <Button
              variant="contained"
              color="primary"
              sx={{ height: 50 }}
              onClick={handleClickOpen}
            >
              Make Transaction
            </Button>
            <MakeTransaction
              open={transactionDialogState.open}
              handleClose={handleClose}
            />
          </form>
        </Box>
      </>
    </div>
  );
};

export default TransactionsButtons;
