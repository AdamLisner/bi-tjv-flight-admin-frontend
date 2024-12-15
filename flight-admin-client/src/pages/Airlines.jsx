import React, { useState, useEffect } from 'react';
import { getAllAirlines, deleteAirline } from "../services/airlineService";
import { Link } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, Box, IconButton, Button, CircularProgress, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; 

const Airlines = () => {
  const [airlines, setAirlines] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    setLoading(true); 
    setError(null); 
    try {
      const data = await getAllAirlines();
      setAirlines(data);
      setLoading(false); 
    } catch (error) {
      console.error('Failed to fetch airlines:', error);
      setLoading(false);
      setError('Failed to fetch airlines, please try again later.');
    }
  };

  const handleDelete = async (airlineId) => {
    setLoading(true); 
    try {
      await deleteAirline(airlineId);  
      fetchAirlines();  
    } catch (error) {
      console.error('Failed to delete airline:', error);
      setLoading(false); 
      setError('Failed to delete airline, please try again later.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: '100vh', padding: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" gutterBottom>
          Airlines
        </Typography>
        <Button
          component={Link}
          to="/create-airline"
          variant="contained"
          color="primary" 
          sx={{ padding: '10px 20px' }}
        >
          Create New Airline
        </Button>
      </Box>

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

      {/* Display the airlines */}
      {!loading && !error && (
        <Grid container spacing={4}>
          {airlines.map((airline) => (
            <Grid item xs={12} sm={6} md={4} key={airline.id}>
              <Card sx={{ transition: '0.3s', '&:hover': { boxShadow: 3 } }}>
                <CardContent>
                  <Link
                    to={`/airlines/${airline.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                      {airline.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Founded: {airline.yearFounded}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Headquarters: {airline.headquarters}
                    </Typography>
                  </Link>

                  {/* Delete Icon Button */}
                  <Box textAlign="right" mt={2}>
                    <IconButton
                      color="secondary"
                      onClick={() => handleDelete(airline.id)}
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

export default Airlines;
