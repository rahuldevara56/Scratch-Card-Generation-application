import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  TextField,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useForm, Controller } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-hot-toast';
import { useAtom } from 'jotai';
import { userModalAtom } from '../../store/userStore';
import { useEffect } from 'react';
import { postUser } from './utils/postUser';
import { updateUser } from './utils/updateUser';

const schema = yup.object().shape({
  userEmail: yup.string().email().required('Email is required'),
  firstName: yup.string().min(2).max(100).required('First name is required'),
  lastName: yup.string().min(2).max(100).required('Last name is required'),
});

const defaultValues = {
  userEmail: '',
  firstName: '',
  lastName: '',
};

export default function CustomizedDialogs({ handleClose }) {
  const [userModal] = useAtom(userModalAtom);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: userModal.userData ?? defaultValues,
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(userModal.mode === 'edit' ? userModal.userData : defaultValues);
  }, [reset, userModal.mode, userModal.userData]);

  console.log('userModal data in AddUser:', userModal);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: postUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['users']);
      toast.success(
        `User added successfully: ${response.data.firstName} ${response.data.lastName}`
      );
      reset();
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || 'Failed to add user. Please try again.'
      );
    },
  });

  const updateMutate = useMutation({
    mutationFn: updateUser,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['users']);
      toast.success(response?.message);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Failed to update user. Please try again.'
      );
    },
  });

  const onSubmit = async (data) => {
    if (userModal.mode === 'add') {
      mutation.mutate(data);
    } else if (userModal.mode === 'edit') {
      updateMutate.mutate({ id: userModal.userData.id, ...data });
    }
    handleClose();
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      sx={{}}
      open={userModal.open}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Typography variant="h6" fontSize={30}>
          {userModal.mode === 'add' ? 'Add User' : 'Edit User'}
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
          {/* Email Field */}
          <Controller
            name="userEmail"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                variant="filled"
                fullWidth
                error={!!errors.userEmail}
                helperText={errors.userEmail ? errors.userEmail.message : ''}
              />
            )}
          />

          {/* First Name Field */}
          <Controller
            name="firstName"
            control={control}
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
