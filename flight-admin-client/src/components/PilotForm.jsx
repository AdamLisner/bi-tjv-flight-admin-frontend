import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Box, Typography, Select, MenuItem, InputLabel, FormControl, CircularProgress } from '@mui/material';
import { createPilot } from '../services/pilotService'; // Import your createPilot function
import { getAllAirlines } from '../services/airlineService'; // Import function to get airlines
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const PilotForm = () => {
  const [newPilot, setNewPilot] = useState({
    pilotId: 1,
    firstName: '',
    lastName: '',
    nickname: '',
    dateOfBirth: '',
    airlineId: '',
  });

  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state for fetching airlines
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Fetch the list of airlines when the component mounts
  useEffect(() => {
    const fetchAirlinesList = async () => {
      setLoading(true);
      try {
        const data = await getAllAirlines();
        setAirlines(data);
      } catch (error) {
        console.error('Failed to fetch airlines:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAirlinesList();
  }, []);

  // Handles input changes and updates the state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPilot((prev) => ({ ...prev, [name]: value }));
  };

  // Handles form submission and creates the pilot
  const handleCreatePilot = async (e) => {
    e.preventDefault();

    try {
      console.log('Submitting form...'); // Debugging line to check form submission
      await createPilot(newPilot);  // Call createPilot function to add the new pilot
      setNewPilot({
        pilotId: 1, firstName: '', lastName: '', nickname: '', dateOfBirth: '', airlineId: '',
      });  // Reset form

      // Make sure to log that the redirect is happening
      console.log('Redirecting to /pilots...');
      navigate('/pilots'); // Redirect to pilots page after successful creation
    } catch (error) {
      console.error('Failed to create pilot:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ backgroundColor: 'white', padding: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Add Pilot
        </Typography>
        <form onSubmit={handleCreatePilot}>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            name="firstName"
            value={newPilot.firstName}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            name="lastName"
            value={newPilot.lastName}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Nickname"
            variant="outlined"
            fullWidth
            name="nickname"
            value={newPilot.nickname}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
          />

          <TextField
            label="Date of Birth"
            variant="outlined"
            fullWidth
            type="date"
            name="dateOfBirth"
            value={newPilot.dateOfBirth}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
            InputLabelProps={{ shrink: true }}  // Ensures the label stays on top of the input when date is selected
          />

          {/* Airline Select Dropdown */}
          {loading ? (
            <Box textAlign="center" my={2}>
              <CircularProgress />
            </Box>
          ) : (
            <FormControl fullWidth sx={{ marginBottom: 2 }} required>
              <InputLabel>Airline</InputLabel>
              <Select
                label="Airline"
                name="airlineId"
                value={newPilot.airlineId}
                onChange={handleInputChange}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {airlines.map((airline) => (
                  <MenuItem key={airline.id} value={airline.id}>
                    {airline.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: 1.5, fontSize: '1rem' }}
          >
            Add Pilot
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default PilotForm;
