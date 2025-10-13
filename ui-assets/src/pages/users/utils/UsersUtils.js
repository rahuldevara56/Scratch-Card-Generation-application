import axios from 'axios';

export const fetchUsers = async () => {
  const response = await axios.get('/api/users');
  return response.data.data;
};

export const deleteUser = async (data) => {
  const response = await axios.delete(`/api/users/${data.id}`);
  return response.data;
};

export const postUser = async (data) => {
  const response = await axios.post('/api/users', data);
  return response.data;
};

export const updateUser = async (data) => {
  const response = await axios.put(
    `/api/users/${data.id}`,
    { ...data },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  return response.data;
};

export const updateActiveUsers = async (data) => {
  const response = await axios.put('/api/users/activate', { ids: data });
  return response.data;
};

export const updateInactiveUsers = async (data) => {
  const response = await axios.put('/api/users/deactivate', { ids: data });
  return response.data;
};
