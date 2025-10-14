import axios from 'axios';

export const fetchTransactions = async (data) => {
  const response = await axios.get('/api/transactions');
  return response.data.data;
};

export const fetchUserById = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data; // Assumes { firstName, lastName, ... }
};
