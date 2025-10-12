import React from 'react';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { userModalAtom } from '../../store/userStore';

const ActionButtons = ({ data }) => {
  const [userModal, setUserModal] = useAtom(userModalAtom);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (data) => {
      const response = await axios.delete(`/api/users/${data.id}`);
      return response.data;
    },
  });

  const handleDelete = (id) => {
    mutate(
      { id },
      {
        onSuccess: (response) => {
          queryClient.invalidateQueries(['users']);
          toast.success(response?.message);
        },
        onError: (error) => {
          toast.error(
            error.response?.data?.message ||
              'Failed to delete user. Please try again.'
          );
        },
      }
    );
  };

  const handleEdit = () => {
    setUserModal({ ...userModal, open: true, mode: 'edit', userData: data });
  };
  return (
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
      <IconButton aria-label="edit" color="primary">
        <EditIcon onClick={handleEdit} />
      </IconButton>
      <IconButton aria-label="delete" color="error">
        <DeleteIcon onClick={() => handleDelete(data.id)} />
      </IconButton>
    </div>
  );
};

export default ActionButtons;
