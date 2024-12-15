import React, { useState, useEffect } from 'react';
import { deleteAircraft, getAllAircrafts } from '../services/aircraftService';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Box, 
  Button, 
  IconButton,
  CircularProgress, 
  Alert 
} from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from "@mui/icons-material/Delete";



const Aircrafts = () => {
  const [aircrafts, setAircrafts] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetchAircrafts();
  }, []);

  const fetchAircrafts = async () => {
    setLoading(true); 
    setError(null); 
    try {
      const data = await getAllAircrafts();
      setAircrafts(data);
      setLoading(false); 
    } catch (error) {
      console.error('Failed to fetch aircrafts:', error);
      setLoading(false); 
      setError('Failed to fetch aircrafts, please try again later.');
    }
  };

  const handleDeleteAircraft = async (id) => {
    setLoading(true); 
    try {
      await deleteAircraft(id); 
      fetchAircrafts(); 
    } catch (error) {
      console.error("Failed to delete aircraft:", error);
      setLoading(false); 
      setError("Failed to delete aircraft, please try again later.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', padding: 4 }}>
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
                  <Box textAlign="right" mt={2}>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDeleteAircraft(aircraft.id)}
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

export default Aircrafts;
