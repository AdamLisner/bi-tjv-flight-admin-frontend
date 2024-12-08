import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const Home = () => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      padding: 4,
    }}
  >
    <Container maxWidth="sm" sx={{ textAlign: 'center' }}>
      <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', color: '#3f51b5', mb: 2 }}>
        Flight Administration
      </Typography>
      <Typography variant="h5" sx={{ color: '#555', mb: 4 }}>
        Semestrální práce do předmětu BI-TJV
      </Typography>

      <Button
        variant="contained"
        color="primary"
        href="https://gitlab.fit.cvut.cz/lisneada/bi-tjv-semestralni-prace-letadla"
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          padding: '10px 20px',
          fontSize: '1rem',
          fontWeight: 'bold',
          textTransform: 'none',
        }}
      >
        View Repository
      </Button>
    </Container>
  </Box>
);

export default Home;
