import { useForm, Controller } from 'react-hook-form';
import Dialog from '@mui/material/Dialog';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  DialogTitle,
  DialogContent,
  Typography,
  TextField,
} from '@mui/material';
import Button from '@mui/material/Button';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postTransaction } from './utils/FetchTransactions';

const schema = yup.object().shape({
  username: yup.string().required('Username is required'),
  amount: yup.number().positive().required('Amount is required'),
});

export default function MakeTransaction({ open, handleClose }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries(['transactions']);
      alert('Transaction created successfully');
      handleClose(); // Close dialog
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog">
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          <Typography variant="h6" fontSize={30}>
            Make Transaction
          </Typography>
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: 'absolute',
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent dividers sx={{ width: 400 }}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              padding: 20,
              maxWidth: 400,
              display: 'flex',
              flexDirection: 'column',
              gap: 20,
            }}
          >
            <Controller
              name="username"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Username"
                  variant="filled"
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username ? errors.username.message : ''}
                />
              )}
            />
            <Controller
              name="amount"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  variant="filled"
                  fullWidth
                  type="number"
                  error={!!errors.amount}
                  helperText={errors.amount ? errors.amount.message : ''}
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
