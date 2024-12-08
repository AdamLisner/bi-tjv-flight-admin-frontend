import React, { useState, useEffect } from "react";
import { getAllFlights } from "../services/flightService";
import { Link } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  useEffect(() => {
    fetchFlights();
  }, []);

  const fetchFlights = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset any previous errors
    try {
      const data = await getAllFlights();
      setFlights(data);
      setLoading(false); // Stop loading once data is fetched
    } catch (error) {
      console.error("Failed to fetch flights:", error);
      setLoading(false); // Stop loading in case of an error
      setError("Failed to fetch flights, please try again later.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", padding: 4 }}>
      {/* Flex container to align the header and button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Flights
        </Typography>

        {/* Link to create new flight */}
        <Button
          component={Link}
          to="/create-flight"
          variant="contained"
          color="primary"
          sx={{ padding: "10px 20px" }}
        >
          Create New Flight
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

      {/* Flights List */}
      {!loading && !error && (
        <Grid container spacing={4}>
          {flights.map((flight) => (
            <Grid item xs={12} sm={6} md={4} key={flight.id}>
              <Card sx={{ transition: "0.3s", "&:hover": { boxShadow: 3 } }}>
                <CardContent>
                  <Link
                    to={`/flights/${flight.id}`}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                      {flight.destinationFrom} → {flight.destinationTo}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Departure: {new Date(flight.departureTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Arrival: {new Date(flight.arrivalTime).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Occupancy: {flight.occupancy} passengers
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

export default Flights;
