import axios from 'axios';

export const fetchScratchCards = async (data) => {
  const response = await axios.get('/api/scratchcards');
  return response.data.data;
};
