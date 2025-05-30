import React, { useState } from "react";
import { createAirline } from "../services/airlineService";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material"; 

const AirlineForm = () => {
  const [newAirline, setNewAirline] = useState({
    id: 1,
    name: "",
    yearFounded: "",
    headquarters: "",
  });

  const [formError, setFormError] = useState("");

  const navigate = useNavigate(); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAirline((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await createAirline(newAirline); 
      setNewAirline({ id: 1, name: "", yearFounded: "", headquarters: "" }); 
      navigate("/airlines"); 
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setFormError(
          "Conflict: Airline with this name already exists, please find a different one"
        );
      } else {
        console.log("Failed to create airline:", error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          backgroundColor: "white",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Create New Airline
        </Typography>
        <form onSubmit={handleFormSubmit}>
          <TextField
            label="Airline Name"
            variant="outlined"
            fullWidth
            name="name"
            value={newAirline.name}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Year Founded"
            variant="outlined"
            fullWidth
            type="number"
            name="yearFounded"
            value={newAirline.yearFounded}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
          />

          <TextField
            label="Headquarters"
            variant="outlined"
            fullWidth
            name="headquarters"
            value={newAirline.headquarters}
            onChange={handleInputChange}
            sx={{ marginBottom: 2 }}
            required
          />

          {formError && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {formError}
            </Typography>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: 1.5, fontSize: "1rem" }}
          >
            Create Airline
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AirlineForm;
