import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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

const TransactionsButtons = () => {
  const [transactionDialogState, setTransactionDialogState] = useAtom(
    transactionDialogAtom
  );

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      transactionAmount: '',
      transactionDate: null,
      user: null,
    },
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

  const handleClearFilters = () => {
    reset();
    setTransactionDialogState({
      ...transactionDialogState,
      dateOfTransaction: null,
      userId: null,
      transactionAmount: null,
    });
  };

  return (
    <div>
      <>
        <Box px={3} py={4}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              display: 'flex',
              gap: 16,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
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
                  }
                  sx={{ width: 250 }}
                  onChange={(_event, newValue) => field.onChange(newValue)}
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
                  label="Transaction Amount"
                  type="number"
                  placeholder="transactionAmount"
                  inputProps={{ min: 1 }}
                  sx={{ width: 250 }}
                />
              )}
            />

            <Controller
              name="transactionDate"
              control={control}
              render={({ field }) => (
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    {...field}
                    label="Transaction Date"
                    sx={{ width: 250 }}
                  />
                </LocalizationProvider>
              )}
            />

            <Button
              variant="contained"
              color="success"
              type="submit"
              sx={{ height: 53 }}
            >
              <SearchIcon />
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters}
              sx={{ height: 56, borderColor: 'grey.500', color: 'grey.700' }}
            >
              Clear Filters
            </Button>
          </form>

          <Box mt={4} sx={{ textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              sx={{ height: 56 }}
              onClick={handleClickOpen}
            >
              Make Transaction
            </Button>
            <MakeTransaction
              open={transactionDialogState.open}
              handleClose={handleClose}
            />
          </Box>
        </Box>
      </>
    </div>
  );
};

export default TransactionsButtons;
