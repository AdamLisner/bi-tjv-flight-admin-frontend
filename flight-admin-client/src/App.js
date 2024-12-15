import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import Home from './pages/Home';
import Pilots from './pages/Pilots';
import Airlines from './pages/Airlines';
import AirlineForm from './components/AirlineForm';
import AircraftForm from './components/AircraftForm';
import Aircrafts from './pages/Aircrafts';
import PilotForm from './components/PilotForm';
import Flights from './pages/Flights';
import FlightForm from './components/FlightForm';

function App() {
  return (
    <Router>
      {/* Navigation Bar */}
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flight Administration
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/airlines">
            Airlines
          </Button>
          <Button color="inherit" component={Link} to="/pilots">
            Pilots
          </Button>
          <Button color="inherit" component={Link} to="/aircrafts">
            Aircrafts
          </Button>
          <Button color="inherit" component={Link} to="/flights">
            Flights
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ marginTop: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pilots" element={<Pilots />} />
          <Route path="/airlines" element={<Airlines />} />
          <Route path="/create-airline" element={<AirlineForm />} />
          <Route path="/aircrafts" element={<Aircrafts />} />
          <Route path="/create-aircraft" element={<AircraftForm />} />
          <Route path="/create-pilot" element={<PilotForm />} />
          <Route path="/flights" element={<Flights/>}/>
          <Route path="/create-flight" element={<FlightForm/>}/>
          <Route path="/airline/:id" element = {<AirlineDetail/>}/>
        </Routes>
      </Container> 
    </Router>
  );
}

export default App;
