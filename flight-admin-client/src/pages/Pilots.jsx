import React, { useState, useEffect } from 'react';
import { getAllPilots, deletePilot } from '../services/pilotService';
import { Button, Container, Grid, Box, Typography, Card, CardContent, IconButton, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';

const Pilots = () => {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    fetchPilots();
  }, []);

  // Fetch all pilots
  const fetchPilots = async () => {
    setLoading(true); // Start loading when fetching data
    setError(null); // Reset any previous errors
    try {
      const data = await getAllPilots();
      setPilots(data);
      setLoading(false); // Stop loading once data is fetched
    } catch (error) {
      console.error('Failed to fetch pilots:', error);
      setLoading(false);
      setError('Failed to fetch pilots, please try again later.');
    }
  };

  // Handle delete pilot
  const handleDeletePilot = async (id) => {
    setLoading(true); // Start loading when deleting
    try {
      await deletePilot(id); // Call the delete method
      fetchPilots(); // Refetch the data after deletion
    } catch (error) {
      console.error('Failed to delete pilot:', error);
      setLoading(false); // Stop loading in case of error
      setError('Failed to delete pilot, please try again later.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Pilots
        </Typography>
        {/* Create New Pilot Button on the right */}
        <Button
          component={Link}
          to="/create-pilot"
          variant="contained"
          color="primary" // Blue color
          sx={{ padding: '10px 20px' }}
        >
          Add New Pilot
        </Button>
      </Box>

      {/* Show loading spinner or error */}
      {loading && (
        <Box textAlign="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box my={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {/* Display the pilots */}
      {!loading && !error && (
        <Grid container spacing={4}>
          {pilots.map((pilot) => (
            <Grid item xs={12} sm={6} md={4} key={pilot.pilotId}>
              <Card sx={{ transition: '0.3s', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {pilot.firstName} {pilot.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nickname: {pilot.nickname}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date of Birth: {new Date(pilot.dateOfBirth).toLocaleDateString()}
                  </Typography>

                  {/* Delete Icon Button */}
                  <Box textAlign="right" mt={2}>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeletePilot(pilot.pilotId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Pilots;
