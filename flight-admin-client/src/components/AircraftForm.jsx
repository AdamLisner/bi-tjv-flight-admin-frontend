import React, { useState, useEffect } from "react";
import { createAircraft } from "../services/aircraftService";
import { getAllAirlines } from "../services/airlineService"; // Assuming you have this service
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const AircraftForm = () => {
  const [newAircraft, setNewAircraft] = useState({
    id: 1,
    manufactureYear: "",
    manufacturer: "",
    model: "",
    capacity: "",
    weight: "",
    airlineId: "",
  });

  const [airlines, setAirlines] = useState([]);
  const navigate = useNavigate();

  // Fetch airlines when component is mounted
  useEffect(() => {
    const fetchAirlines = async () => {
      try {
        const data = await getAllAirlines();
        setAirlines(data);
      } catch (error) {
        console.log("Failed to fetch airlines:", error);
      }
    };

    fetchAirlines();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAircraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAircraft(newAircraft);
      setNewAircraft({
        id: 1,
        manufactureYear: "",
        manufacturer: "",
        model: "",
        capacity: "",
        weight: "",
        airlineId: "",
      });
      navigate("/aircrafts"); // Redirect to aircrafts list after submission
    } catch (error) {
      console.log("Failed to create aircraft:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Create New Aircraft
        </Typography>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Aircraft Model"
            name="model"
            value={newAircraft.model}
            onChange={handleInputChange}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Manufacturer"
            name="manufacturer"
            value={newAircraft.manufacturer}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Manufacture Year"
            name="manufactureYear"
            value={newAircraft.manufactureYear}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Capacity (Passengers)"
            name="capacity"
            value={newAircraft.capacity}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="number"
            label="Weight (kg)"
            name="weight"
            value={newAircraft.weight}
            onChange={handleInputChange}
          />

          {/* Airline Selection */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Airline</InputLabel>
            <Select
              name="airlineId"
              value={newAircraft.airlineId}
              onChange={handleInputChange}
              label="Airline"
            >
              {airlines.map((airline) => (
                <MenuItem key={airline.id} value={airline.id}>
                  {airline.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Aircraft
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default AircraftForm;
