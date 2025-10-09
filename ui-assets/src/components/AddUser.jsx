import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';

export default function CustomizedDialogs({ open, handleClose }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });
  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      sx={{}}
      open={open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Typography variant="h6">Add User</Typography>
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
          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Enter a valid email address',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="filled"
                fullWidth
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ''}
              />
            )}
          />

          {/* First Name Field */}
          <Controller
            name="firstName"
            control={control}
            rules={{
              required: 'First name is required',
              minLength: { value: 1, message: 'Minimum 1 characters required' },
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'Enter a valid first name',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="First Name"
                variant="filled"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName ? errors.firstName.message : ''}
              />
            )}
          />

          {/* Last Name Field */}
          <Controller
            name="lastName"
            control={control}
            rules={{
              required: 'Last name is required',
              minLength: { value: 1, message: 'Minimum 1 characters required' },
              pattern: {
                value: /^[A-Za-z]+$/,
                message: 'Enter a valid last name',
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Last Name"
                variant="filled"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName ? errors.lastName.message : ''}
              />
            )}
          />

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
