import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import { Box } from '@mui/system';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useAtom } from 'jotai';
import { transactionDialogAtom } from '../../store/userStore';
import MakeTransaction from './MakeTransaction';

const TransactionsButtons = () => {
  const [open, setOpen] = useAtom(transactionDialogAtom);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <>
        <Box
          px={3}
          py={4}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' },
            gap: 3,
            alignItems: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: 2,
            boxShadow: 1,
            padding: 2,
          }}
        >
          <FormControl fullWidth sx={{ width: '100%', height: 48 }}>
            <InputLabel>User</InputLabel>
            <Select label="User">
              <MenuItem value="">-- Select User --</MenuItem>
              <MenuItem value="1">User 1</MenuItem>
              <MenuItem value="2">User 2</MenuItem>
            </Select>
          </FormControl>

          <TextField
            required
            id="outlined-required"
            label="Transaction Amount"
            type="number"
            placeholder="transactionAmount"
            sx={{ width: '100%', maxWidth: 250, height: 48 }}
            inputProps={{ min: 1 }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['DatePicker']}>
              <DatePicker label="Transaction Date" sx={{ width: '100%' }} />
            </DemoContainer>
          </LocalizationProvider>

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
          <MakeTransaction open={open} handleClose={handleClose} />
        </Box>
      </>
    </div>
  );
};

export default TransactionsButtons;
