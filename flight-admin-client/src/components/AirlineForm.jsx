import React, { useState } from 'react';
import { createAirline } from '../services/airlineService';
import { useNavigate } from 'react-router-dom';  // Import useNavigate hook
import { TextField, Button, Container, Typography, Box } from '@mui/material';  // Material-UI components

const AirlineForm = () => {
  const [newAirline, setNewAirline] = useState({
    id: 1,
    name: '',
    yearFounded: '',
    headquarters: '',
  });

  const navigate = useNavigate();  // Initialize the navigate function

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirline((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAirline(newAirline);  // Create the airline
      setNewAirline({ id: 1, name: '', yearFounded: '', headquarters: '' });  // Reset form
      navigate('/airlines');  // Redirect to /airlines after successful form submission
    } catch (error) {
      console.log('Failed to create airline:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Create New Airline
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Airline Name"
            variant="outlined"
            fullWidth
            name="name"
            value={newAirline.name}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Year Founded"
            variant="outlined"
            fullWidth
            type="number"
            name="yearFounded"
            value={newAirline.yearFounded}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Headquarters"
            variant="outlined"
            fullWidth
            name="headquarters"
            value={newAirline.headquarters}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: 1.5, fontSize: '1rem' }}
          >
            Create Airline
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AirlineForm;
