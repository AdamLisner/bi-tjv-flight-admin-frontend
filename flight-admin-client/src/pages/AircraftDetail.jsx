import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getAircraftById } from "../services/aircraftService"; 
import { Container, Typography, Box, Divider } from "@mui/material";

const AircraftDetail = () => {
  const { id } = useParams(); 
  const [aircraft, setAircraft] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAircraftDetails();
  }, []);

  const fetchAircraftDetails = async () => {
    try {
      const data = await getAircraftById(id); 
      setAircraft(data);
    } catch (err) {
      console.error("Failed to fetch aircraft details:", err);
      setError("Unable to load aircraft details. Please try again later.");
    }
  };

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!aircraft) {
    return (
      <Container>
        <Typography variant="h6">Loading aircraft details...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 4 }}>
      <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: "8px" }}>
        <Typography variant="h4" gutterBottom>
          Aircraft Details
        </Typography>
        <Divider sx={{ marginY: 2 }} />
        <Typography variant="body1" gutterBottom>
          <strong>Model:</strong> {aircraft.model}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Manufacturer:</strong> {aircraft.manufacturer}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Manufacture Year:</strong> {aircraft.manufactureYear}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Capacity:</strong> {aircraft.capacity} passengers
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Weight:</strong> {aircraft.weight} kg
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Airline:</strong>{" "}
          <Link to={`/airlines/${aircraft.airlineId}`}>View Airline</Link>
        </Typography>
        
      </Box>
    </Container>
  );
};

export default AircraftDetail;
