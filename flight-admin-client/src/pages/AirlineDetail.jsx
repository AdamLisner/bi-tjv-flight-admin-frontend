import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { getAirlineById } from "../services/airlineService";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";

import { getAircraftsByAirlineId } from "../services/aircraftService";
import { getPilotsByAirlineId } from "../services/pilotService";

import { Link } from "react-router-dom";

const AirlineDetail = () => {
  const { id } = useParams();
  const [airline, setAirline] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pilots, setPilots] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);

  useEffect(() => {
    const fetchAirline = async () => {
      setLoading(true);
      setError(null);
      try {
        const airlineData = await getAirlineById(id); 
        const pilotsData = await getPilotsByAirlineId(id);
        const aircraftsData = await getAircraftsByAirlineId(id);

        setAirline(airlineData);
        setPilots(pilotsData);
        setAircrafts(aircraftsData);

        setLoading(false);
      } catch (err) {
        console.log(err.response.status);
        switch (err.response.status) {
          case 400:
            setError("Something went wrong...");
            break;
          case 404:
            setError("No airline found.");
            break;
          default:
            setError("Failed to load airline details. Please try again later.");
        }
        setLoading(false); 
      }
    };

    fetchAirline();
  }, [id]); 

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{ fontWeight: "bold", mb: 2 }}
      >
        Airline Details
      </Typography>
      {airline ? (
        <Box>
          <Typography variant="h6">Name: {airline.name}</Typography>
          <Typography variant="body1">
            Founded: {airline.yearFounded}
          </Typography>
          <Typography variant="body1">
            Headquarters: {airline.headquarters}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1">
          No details available for this airline.
        </Typography>
      )}

      {/* Pilots List */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Pilots
        </Typography>
        <Grid container spacing={4}>
          {pilots.map((pilot) => (
            <Grid item xs={12} sm={6} md={4} key={pilot.pilotId}>
              <Card>
              <Link to={`/pilots/${pilot.pilotId}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {pilot.firstName} {pilot.lastName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Nickname: {pilot.nickname}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Date of Birth:{" "}
                    {new Date(pilot.dateOfBirth).toLocaleDateString()}
                  </Typography>
                </CardContent>
                </Link>
              </Card>
            </Grid>
          ))}
          {pilots.length === 0 && (
            <Box mt={4}>
              <Typography variant="body2" color="textSecondary">
                No pilots available for this airline.
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>

      {/* Aircrafts List */}
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Aircrafts
        </Typography>
        <Grid container spacing={4}>
          {aircrafts.map((aircraft) => (
            <Grid item xs={12} sm={6} md={4} key={aircraft.id}>
              <Card>
             
                
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {aircraft.model} ({aircraft.manufacturer})
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Year: {aircraft.manufactureYear}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Capacity: {aircraft.capacity} passengers
                  </Typography>
                </CardContent>
        
              </Card>
            </Grid>
          ))}
          {aircrafts.length === 0 && (
            <Box mt={4}>
              <Typography variant="body2" color="textSecondary">
                No aircrafts available for this airline.
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default AirlineDetail;
