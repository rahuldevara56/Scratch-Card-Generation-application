import axios from 'axios';

// export const fetchTransactions = async (
//   dateOfTransaction,
//   userId,
//   transactionAmount
// ) => {
//   const response = await axios.get(
//     `/api/transactions?dateOfTransaction=${dateOfTransaction}&userId=${userId}&transactionAmount=${transactionAmount}`
//   );

//   return response.data.data;
// };

export const fetchTransactions = async (
  dateOfTransaction,
  userId,
  transactionAmount
) => {
  const response = await axios.get(`/api/transactions`);

  return response.data.data;
};

export const postTransaction = async (transactionData) => {
  console.log('Posting transaction data:', transactionData);
  const response = await axios.post('/api/transactions', transactionData);
  return response.data; // Assumes { id, transactionAmount, dateOfTransaction, userId }
};

export const fetchUserById = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data; // Assumes { firstName, lastName, ... }
};
