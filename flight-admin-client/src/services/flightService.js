import API from "./api";

export const getAllFlights = async () => {
    const response = await API.get('/flights');
    return response.data;
  };

  


  export const getFlightById = async (id) => {
    const response = await API.get(`/flights/${id}`);
    return response.data;
  };
  

  export const getFlightsByPilot = async (pilotId) => {
    const response = await API.get(`/flights/pilot/${pilotId}`);
    return response.data;
  };
  

  export const getFlightsByAircraft = async (aircraftId) => {
    const response = await API.get(`/flights/aircraft/${aircraftId}`);
    return response.data;
  };

  export const createFlight = async (flightData) => {
    const response = await API.post('/flights', flightData);
    return response.data;
  };


  export const deleteFlight = async (id) => {
    await API.delete(`/flights/${id}`);
  };
  

  export const updateFlightDestinations = async (id, flightData) => {
    const response = await API.patch(`/flights/${id}`, flightData);
    return response.data;
  };
  

  export const changeFlightTime = async (id, timeData) => {
    const response = await API.patch(`/flights/${id}/time`, timeData);
    return response.data;
  };


  export const changeFlightOccupancy = async (id, occupancy) => {
    const response = await API.patch(`/flights/${id}/occupancy/${occupancy}`);
    return response.data;
  };
  

  export const changeFlightPilot = async (flightId, pilotId) => {
    const response = await API.patch(`/flights/${flightId}/pilot/${pilotId}`);
    return response.data;
  };
  
  

  export const changeFlightAircraft = async (flightId, aircraftId) => {
    const response = await API.patch(`/flights/${flightId}/aircraft/${aircraftId}`);
    return response.data;
  };
  
  
  