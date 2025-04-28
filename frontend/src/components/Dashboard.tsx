import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import GoodsList from './GoodsList';
import AddGoodForm from './AddGoodForm';

const Dashboard: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Панель управления
        </Typography>
        <AddGoodForm />
        <GoodsList />
      </Box>
    </Container>
  );
};

export default Dashboard; 