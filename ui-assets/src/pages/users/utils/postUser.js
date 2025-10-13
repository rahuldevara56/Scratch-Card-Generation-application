import axios from 'axios';

export const postUser = async (data) => {
  const response = await axios.post('/api/users', data);
  return response.data;
};
