import axios from 'axios';

let data = null;

export const fetchScratchCards = async () => {
  const response = await axios.get('/api/scratchcards');
  data = response.data.data;
  return data;
};

export const assignScratchCard = async ({ scratchCardId, userId }) => {
  const response = await axios.post('/api/scratchcards/assign', {
    scratchCardId,
    userId,
  });
  return response.data;
};

export const fetchUsers = async () => {
  const response = await axios.get('/api/users');
  return response.data.data;
};
