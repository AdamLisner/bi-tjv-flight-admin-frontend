import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getFlightById,
  changeFlightTime,
  changeFlightPilot,
  changeFlightAircraft,
} from "../services/flightService";
import { getAirlineById } from "../services/airlineService";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Divider,
} from "@mui/material";
import {
  getAircraftById,
  getAircraftsByAirlineId,
} from "../services/aircraftService";
import { getPilotsByAirlineId } from "../services/pilotService";
import { changeFlightOccupancy } from "../services/flightService";
import { deleteFlight } from "../services/flightService";
import { useNavigate } from "react-router-dom";
import { updateFlightDestinations } from "../services/flightService";

const FlightDetail = () => {
  const { id } = useParams(); 
  const [flight, setFlight] = useState(null);
  const [aircraft, setAircraft] = useState(null);
  const [pilots, setPilots] = useState([]);
  const [aircrafts, setAircrafts] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [pilotError, setPilotError] = useState("");
  const [aircraftError, setAircraftError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchFlightDetails();
  }, [id]);

  const fetchFlightDetails = async () => {
    setLoading(true);
    try {
      const flightData = await getFlightById(id);
      setFlight(flightData);

      const aircraftData = await getAircraftById(flightData.aircraftId);
      setAircraft(aircraftData);
      const airlineData = await getAirlineById(aircraftData.airlineId);

      const aircraftByAirline = await getAircraftsByAirlineId(airlineData.id);
      const pilotsByAirline = await getPilotsByAirlineId(airlineData.id);
      setPilots(pilotsByAirline || []);
      setAircrafts(aircraftByAirline || []);

      setForm({
        departureTime: flightData.departureTime,
        arrivalTime: flightData.arrivalTime,
        pilotId: flightData.pilotId,
        aircraftId: flightData.aircraftId,
        destinationFrom: flightData.destinationFrom,
        destinationTo: flightData.destinationTo,
        occupancy: flightData.occupancy,
      });
    } catch (err) {
      switch (err.response.status) {
        case 404:
          setError("Flight not found!");
          break;
        case 400:
          setError("Something went wrong");
          break;
        default:
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggle = () => {
    setEditing((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAircraftError("");
    setPilotError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleOccupancyChange = (e) => {
    let { value } = e.target;

    const parsedValue = parseInt(value, 10);

    if (parsedValue === "") {
      setAircraftError("");
      setPilotError("");

      setForm((prev) => ({ ...prev, occupancy: 0 }));
      return;
    }

    if (isNaN(parsedValue)) {
      return;
    }

    if (parsedValue < 0) {
      value = 0;
    } else if (parsedValue > aircraft.capacity) {
      value = aircraft.capacity;
    } else {
      value = parsedValue;
    }

    setAircraftError("");
    setPilotError("");

    setForm((prev) => ({ ...prev, occupancy: value }));
  };

  const handleSubmit = async () => {
    if (form.destinationFrom === form.destinationTo) {
      setError("The destination from and destination to must not be the same.");
      return;
    }
    try {
      if (form.pilotId) {
        await changeFlightPilot(id, form.pilotId);
      }

      if (form.aircraftId) {
        await changeFlightAircraft(id, form.aircraftId);
      }

      if (form.departureTime && form.arrivalTime) {
        await changeFlightTime(id, {
          departureTime: form.departureTime,
          arrivalTime: form.arrivalTime,
        });
      }

      if (form.destinationFrom || form.destinationTo) {
        await updateFlightDestinations(id, {
          destinationFrom: form.destinationFrom,
          destinationTo: form.destinationTo,
        });
      }

      if (form.occupancy !== aircraft.occupancy) {
        await changeFlightOccupancy(id, form.occupancy);
      }

      setEditing(false);
      setPilotError("");
      setAircraftError("");
      fetchFlightDetails();
    } catch (err) {
      if (err.response) {
        switch (err.response.status) {
          case 409:
            if (
              err.response.data ===
              "Error: The pilot is not available during the selected time."
            ) {
              console.log(158);
              setPilotError(
                "The selected pilot is not available. Please choose a different one or change the time"
              );
            }
            if (
              err.response.data ===
              "Error: The aircraft is not available during the selected time."
            ) {
              console.log(166);
              setAircraftError(
                "The selected aircraft is not available. Please choose a different one or change the time"
              );
            }
            break;
          case 400:
            setError("Bad request. Please check your inputs.");
            break;
          case 404:
            setError("Flight not found!");
            break;
          default:
            setError("Failed to update flight. Please try again.");
            break;
        }
      } else {
        setError("Network error. Please check your connection.");
      }
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this flight?"
    );
    if (confirmDelete) {
      try {
        await deleteFlight(id);
        navigate("/flights"); 
      } catch (err) {
        setError("Failed to delete flight. Please try again.");
      }
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

  if (!flight) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ padding: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Flight Details
          </Typography>

          <Divider sx={{ marginY: 2 }} />
          {!editing ? (
            <>
              <Typography variant="body1" gutterBottom>
                <strong>From:</strong> {flight.destinationFrom}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>To:</strong> {flight.destinationTo}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Departure Time:</strong>{" "}
                {new Date(flight.departureTime).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Arrival Time:</strong>{" "}
                {new Date(flight.arrivalTime).toLocaleString()}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Occupancy: </strong>
                {flight.occupancy} / {aircraft.capacity}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Pilot:</strong>{" "}
                <Link to={`/pilots/${flight.pilotId}`}>View Pilot Details</Link>
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Aircraft:</strong>{" "}
                <Link to={`/aircrafts/${flight.aircraftId}`}>
                  View Aircraft Details
                </Link>
              </Typography>
              <Box sx={{ marginTop: 2 }}>
                <Button
                  sx={{ marginRight: 4 }}
                  variant="contained"
                  color="primary"
                  onClick={handleEditToggle}
                >
                  Edit Flight
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDelete}
                >
                  Delete Flight
                </Button>
              </Box>
            </>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="From"
                    name="destinationFrom"
                    value={form.destinationFrom}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="To"
                    name="destinationTo"
                    value={form.destinationTo}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Departure Time"
                    name="departureTime"
                    value={form.departureTime}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label="Arrival Time"
                    name="arrivalTime"
                    value={form.arrivalTime}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="Pilot"
                    name="pilotId"
                    value={form.pilotId}
                    onChange={handleChange}
                    error={Boolean(pilotError)}
                    helperText={pilotError}
                  >
                    {pilots.map((pilot) => (
                      <MenuItem key={pilot.pilotId} value={pilot.pilotId}>
                        {pilot.firstName} {pilot.lastName}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="Aircraft"
                    name="aircraftId"
                    value={form.aircraftId}
                    onChange={handleChange}
                    error={Boolean(aircraftError)}
                    helperText={aircraftError}
                  >
                    {aircrafts.map((aircraft) => (
                      <MenuItem key={aircraft.id} value={aircraft.id}>
                        {aircraft.model}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Occupancy"
                    name="occupancy"
                    value={form.occupancy}
                    onChange={handleOccupancyChange}
                    slotProps={{
                      min: 0,
                      max: aircraft.capacity,
                    }}
                    variant="outlined"
                    size="small"
                  />
                </Grid>
              </Grid>

              <Box sx={{ marginTop: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleEditToggle}
                  sx={{ marginLeft: 2 }}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default FlightDetail;
