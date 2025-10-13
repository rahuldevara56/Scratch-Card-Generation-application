import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddUser from './AddEditUser';
import UserTable from './UserTable';
import Paper from '@mui/material/Paper';
import { useAtom } from 'jotai';
import { userModalAtom } from '../../store/userStore';
import { userGridApiAtom } from '../../store/userStore';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { updateActiveUsers } from './utils/UsersUtils';
import { updateInactiveUsers } from './utils/UsersUtils';

const Users = () => {
  const [userModal, setUserModal] = useAtom(userModalAtom);
  const [gridApi] = useAtom(userGridApiAtom);

  const handleClickOpen = () => {
    setUserModal({ ...userModal, open: true, mode: 'add', userData: null });
  };
  const handleClose = () => {
    setUserModal({ ...userModal, open: false });
  };

  const queryClient = useQueryClient();

  const updateActiveMutate = useMutation({
    mutationFn: updateActiveUsers,
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

  const updateInactiveMutate = useMutation({
    mutationFn: updateInactiveUsers,
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

  const handleClickActive = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data.id);
    updateActiveMutate.mutate(selectedData);
  };

  const handleClickInActive = () => {
    const selectedNodes = gridApi.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data.id);
    updateInactiveMutate.mutate(selectedData);
  };

  return (
    <Paper elevation={3} sx={{ margin: 5, padding: 3 }}>
      <Box
        px={3}
        py={2}
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Users
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<AddIcon />}
            onClick={handleClickOpen}
          >
            Add User
          </Button>
          <AddUser handleClose={handleClose} />

          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onClick={handleClickActive}
          >
            Active
          </Button>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            onClick={handleClickInActive}
          >
            InActive
          </Button>
        </Box>
      </Box>

      <UserTable />
    </Paper>
  );
};

export default Users;
