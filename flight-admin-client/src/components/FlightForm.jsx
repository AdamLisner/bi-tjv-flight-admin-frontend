import React, { useState, useEffect } from "react";
import { createFlight } from "../services/flightService";
import { getAllAirlines } from "../services/airlineService";
import { getAircraftsByAirlineId } from "../services/aircraftService";
import { getPilotsByAirlineId } from "../services/pilotService";
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

const FlightForm = () => {
  const [flightData, setFlightData] = useState({
    destinationFrom: "",
    destinationTo: "",
    occupancy: 0,
    departureTime: "",
    arrivalTime: "",
    airlineId: "",
    aircraftId: "",
    pilotId: "",
  });

  const [airlines, setAirlines] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [pilots, setPilots] = useState([]);
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAirlines();
  }, []);

  const fetchAirlines = async () => {
    try {
      const data = await getAllAirlines();
      setAirlines(data);
    } catch (error) {
      console.log("Failed to fetch airlines:", error);
    }
  };

  const handleAirlineChange = async (event) => {
    const selectedAirlineId = event.target.value;
    setFlightData({
      ...flightData,
      airlineId: selectedAirlineId,
      aircraftId: "",
      pilotId: "",
    });

    try {
      const aircrafts = await getAircraftsByAirlineId(selectedAirlineId);
      const pilots = await getPilotsByAirlineId(selectedAirlineId);
      setAircrafts(aircrafts);
      setPilots(pilots);
    } catch (error) {
      console.log("Error fetching aircrafts or pilots for airline", error);
    }
  };

  const handleAircraftChange = (event) => {
    const selectedAircraftId = event.target.value;
    setFlightData({
      ...flightData,
      aircraftId: selectedAircraftId,
    });
    console.log(flightData);

  };

  const handlePilotChange = (event) => {

    setFlightData({ ...flightData, pilotId: event.target.value });
    console.log(flightData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFlightData((prev) => ({ ...prev, [name]: value }));
  };

  const validateTimes = () => {
    const { departureTime, arrivalTime } = flightData;
    if (new Date(arrivalTime) <= new Date(departureTime)) {
      setFormError("Arrival time must be after departure time.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateTimes()) return;

    try {
      await createFlight(flightData);
      setFlightData({
        destinationFrom: "",
        destinationTo: "",
        occupancy: "",
        departureTime: "",
        arrivalTime: "",
        airlineId: "",
        aircraftId: "",
        pilotId: "",
      });
      setFormError("");
      navigate("/flights");
    } catch (error) { 
      if (error.response) {
        console.log(formError);
        switch (error.response.status) {

        case 409:
          setFormError("Conflict: The selected aircraft or pilot is already assigned to another flight.");
          break;
        case 400:          
          setFormError("Departure destination must be different than arrival destination")
          break;
        default:
          setFormError("Something really unexpected happened :/");

        };
        
     }
      else {
        console.log("Failed to create flight:", error);
      }
    }
  };

  const selectedPilot = pilots.find((pilot) => pilot.id === flightData.pilotId);

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
          Create New Flight
        </Typography>
        <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 3 }}>
          {/* Airline Selection */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="airline-label">Airline</InputLabel>
            <Select
              labelId="airline-label"
              name="airlineId"
              value={flightData.airlineId}
              onChange={handleAirlineChange}
              required
            >
              {airlines.map((airline) => (
                <MenuItem key={airline.id} value={airline.id}>
                  {airline.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="aircraft-label">Aircraft</InputLabel>
            <Select
              labelId="aircraft-label"
              name="aircraftId"
              value={flightData.aircraftId}
              onChange={handleAircraftChange}
              required
              disabled={!flightData.airlineId}
            >
              {aircrafts.map((aircraft) => (
                <MenuItem key={aircraft.id} value={aircraft.id}>
                  {aircraft.model} ({aircraft.manufacturer})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Pilot Selection - After selecting the aircraft, allow pilot to be selected */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="pilot-label">Pilot</InputLabel>
            <Select
              labelId="pilot-label"
              name="pilotId"
              value={flightData.pilotId}
              onChange={handlePilotChange}
              required
              disabled={!flightData.airlineId}
            >
              {pilots.map((pilot) => (
                <MenuItem key={pilot.pilotId} value={pilot.pilotId}>
                  {pilot.firstName} {pilot.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedPilot && (
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="selected-pilot-label">Selected Pilot</InputLabel>
              <Select
                labelId="selected-pilot-label"
                value={`${selectedPilot.firstName} ${selectedPilot.lastName}`}
                disabled
              >
                <MenuItem
                  value={`${selectedPilot.firstName} ${selectedPilot.lastName}`}
                >
                  {selectedPilot.firstName} {selectedPilot.lastName}
                </MenuItem>
              </Select>
            </FormControl>
          )}

          {/* Destination and Times */}
          <TextField
            margin="normal"
            required
            fullWidth
            label="From"
            name="destinationFrom"
            value={flightData.destinationFrom}
            onChange={handleInputChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="To"
            name="destinationTo"
            value={flightData.destinationTo}
            onChange={handleInputChange}
          />
          
          <TextField
            margin="normal"
            required
            fullWidth
            type="datetime-local"
            label="Departure Time"
            name="departureTime"
            value={flightData.departureTime}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            type="datetime-local"
            label="Arrival Time"
            name="arrivalTime"
            value={flightData.arrivalTime}
            onChange={handleInputChange}
            InputLabelProps={{ shrink: true }}
          />

          {/* Error Message */}
          {formError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {formError}
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Create Flight
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default FlightForm;
