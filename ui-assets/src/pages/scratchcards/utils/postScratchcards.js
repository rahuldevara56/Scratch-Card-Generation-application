import axios from 'axios';

export const postScratchcards = async (data) => {
  const response = await axios.post('/api/scratchcards/generate', data);
  return response.data;
};
