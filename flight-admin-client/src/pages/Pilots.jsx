import React, { useState, useEffect } from "react";
import { getAllPilots, deletePilot } from "../services/pilotService";
import {
  Button,
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

const Pilots = () => {
  const [pilots, setPilots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); 

  useEffect(() => {
    fetchPilots();
  }, []);

  
  const fetchPilots = async () => {
    setLoading(true);
    setError(null); 
    try {
      const data = await getAllPilots();
      setPilots(data);
      setLoading(false); 
    } catch (error) {
      console.error("Failed to fetch pilots:", error);
      setLoading(false);
      setError("Failed to fetch pilots, please try again later.");
    }
  };

  const handleDeletePilot = async (id) => {
    setLoading(true); 
    try {
      await deletePilot(id); 
      fetchPilots(); 
    } catch (error) {
      console.error("Failed to delete pilot:", error);
      setLoading(false); 
      setError("Failed to delete pilot, please try again later.");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ minHeight: "100vh", padding: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography variant="h3" gutterBottom>
          Pilots
        </Typography>
        <Button
          component={Link}
          to="/create-pilot"
          variant="contained"
          color="primary" 
          sx={{ padding: "10px 20px" }}
        >
          Add New Pilot
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

      {!loading && !error && (
        <Grid container spacing={4}>
          {pilots.map((pilot) => (
            <Grid item xs={12} sm={6} md={4} key={pilot.pilotId}>
              <Card sx={{ transition: "0.3s", "&:hover": { boxShadow: 3 } }}>
                <CardContent>
                  <Link to={`/pilots/${pilot.pilotId}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }}>
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
                  </Link>
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
