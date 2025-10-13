import axios from 'axios';

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
