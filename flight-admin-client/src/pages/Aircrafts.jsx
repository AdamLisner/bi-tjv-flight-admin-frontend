import React, { useState, useEffect } from 'react';
import { getAllAircrafts } from '../services/aircraftService';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Button, 
  CircularProgress, 
  Alert 
} from '@mui/material';
import { Link } from 'react-router-dom';

const Aircrafts = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const fetchAircrafts = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    try {
      const data = await getAllAircrafts();
      setAircrafts(data);
      setLoading(false); // Stop loading after success
    } catch (error) {
      console.error('Failed to fetch aircrafts:', error);
      setLoading(false); // Stop loading on failure
      setError('Failed to fetch aircrafts, please try again later.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', padding: 4 }}>
      {/* Header and Button alignment */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <Typography variant="h3" gutterBottom>
          Aircrafts
        </Typography>

        <Link to="/create-aircraft">
          <Button
            variant="contained"
            color="primary"
            sx={{ padding: '10px 20px' }}
          >
            Create New Aircraft
          </Button>
        </Link>
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

      {/* Aircraft List */}
      {!loading && !error && (
        <Grid container spacing={4}>
          {aircrafts.map((aircraft) => (
            <Grid item xs={12} sm={6} md={4} key={aircraft.id}>
              <Card sx={{ transition: '0.3s', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Link
                    to={`/aircrafts/${aircraft.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {aircraft.model} ({aircraft.manufacturer})
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Year: {aircraft.manufactureYear}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Capacity: {aircraft.capacity} passengers
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Weight: {aircraft.weight} kg
                    </Typography>
                  </Link>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Aircrafts;
