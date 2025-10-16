import React from 'react';
import { Box, Paper } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useQueryClient } from '@tanstack/react-query';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { postScratchcards } from './utils/postScratchcards';
import Button from '@mui/material/Button';
import { useState } from 'react';

const GenerateScratchCards = () => {
  const [numberOfScratchCards, setNumberOfScratchCards] = useState(1);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: postScratchcards,
    onSuccess: (response) => {
      queryClient.invalidateQueries(['users']);
      toast.success(
        `Scratchcards created successfully: ${response.data.count}`
      );
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          'Failed to create scratchcards. Please try again.'
      );
    },
  });

  const onSubmit = () => {
    mutation.mutate({
      numberOfScratchCards: parseInt(numberOfScratchCards),
    });
  };

  return (
    <Paper elevation={2} sx={{ margin: 5, padding: 3, mx: 40, minHeight: 300 }}>
      <Box
        px={3}
        py={2}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 5,
        }}
      >
        <h1>Generate Scratchcards</h1>
        <TextField
          required
          id="outlined-required"
          label="Number of Scratchcards"
          type="number"
          placeholder="Number of scratchcards"
          sx={{ width: 350 }}
          inputProps={{ min: 1 }}
          value={numberOfScratchCards}
          onChange={(e) => setNumberOfScratchCards(e.target.value)}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ ml: 3 }}
          onClick={() => onSubmit()}
        >
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

export default GenerateScratchCards;
