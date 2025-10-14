import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from './utils/assignScratchCards';

export default function AssignButton() {
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
  return (
    <>
      <Autocomplete
        disablePortal
        options={users || []}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="User" />}
      />
    </>
  );
}
