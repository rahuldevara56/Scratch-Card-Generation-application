import axios from 'axios';

export const deleteUser = async (data) => {
  const response = await axios.delete(`/api/users/${data.id}`);
  return response.data;
};
