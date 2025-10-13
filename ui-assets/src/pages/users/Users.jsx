import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import AddUser from './AddUser';
import UserTable from './UserTable';
import Paper from '@mui/material/Paper';
import { useAtom } from 'jotai';
import { userModalAtom } from '../../store/userStore';

const Users = () => {
  const [userModal, setUserModal] = useAtom(userModalAtom);

  const handleClickOpen = () => {
    setUserModal({ ...userModal, open: true, mode: 'add', userData: null });
  };
  const handleClose = () => {
    setUserModal({ ...userModal, open: false });
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
          >
            Active
          </Button>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
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
