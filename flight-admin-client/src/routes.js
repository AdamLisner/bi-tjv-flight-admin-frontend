import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import PilotsPage from './pages/Pilots';

function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/pilots" component={PilotsPage} />
        {/* Add routes for Flights, Airlines, etc. */}
      </Switch>
    </Router>
  );
}

export default Routes;
