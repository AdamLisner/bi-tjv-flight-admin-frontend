import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getPilotById } from "../services/pilotService";
import { getAirlineById } from "../services/airlineService";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";

const PilotDetail = () => {
  const { id } = useParams(); 
  const [pilot, setPilot] = useState(null);
  const [airline, setAirline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPilotDetails();
  }, [id]);

  const fetchPilotDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const pilotData = await getPilotById(id); 
      setPilot(pilotData);

      if (pilotData.airlineId) {
        const airlineData = await getAirlineById(pilotData.airlineId);
        setAirline(airlineData);
      }
    } catch (err) {
        console.log(err.response.status);
        switch (err.response.status) {
          case 400:
            setError("Something went wrong...");
            break;
          case 404:
            setError("Pilot not found.");
            break;
          default:
            setError("Failed to load airline details. Please try again later.");
        }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" my={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box my={4}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!pilot) {
    return null; 
  }

  return (
    <Container maxWidth="sm" sx={{ padding: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Pilot Details
          </Typography>
          <Divider sx={{ marginY: 2 }} />
          <Typography variant="body1" gutterBottom>
            <strong>Full Name:</strong> {pilot.firstName} {pilot.lastName}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Nickname:</strong> {pilot.nickname || "N/A"}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Date of Birth:</strong> {new Date(pilot.dateOfBirth).toLocaleDateString()}
          </Typography>
          {airline ? (
            <>
              <Typography variant="body1" gutterBottom>
                <strong>Airline:</strong> <Link to={`/airlines/${airline.id}`}>{airline.name}</Link>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Headquarters: {airline.headquarters}
              </Typography>
            </>
          ) : (
            <Typography variant="body1" color="textSecondary">
              This pilot is not currently assigned to an airline.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default PilotDetail;
