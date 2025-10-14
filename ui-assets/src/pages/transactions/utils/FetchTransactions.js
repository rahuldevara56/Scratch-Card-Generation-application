import axios from 'axios';

export const fetchTransactions = async () => {
  const response = await axios.get('/api/transactions');
  return response.data.data;
};

export const fetchUserById = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data; // Assumes { firstName, lastName, ... }
};

export const postTransaction = async (data) => {
  const response = await fetch('/api/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fullName: data.fullName,
      transactionAmount: data.amount,
    }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create transaction');
  }
  return response.json();
};
