import API from './api';

export const getAllPilots = async () => {
  const response = await API.get('/pilots');
  return response.data;
};

export const getPilotById = async (id) => {
  const response = await API.get(`/pilots/${id}`);
  return response.data;
}

export const createPilot = async (pilotData) => {
  const response = await API.post('/pilots', pilotData);
  return response.data;
};

export const deletePilot = async (id) => {
  await API.delete(`/pilots/${id}`);
};

export const updatePilot = async (id, pilotData) => {
  const response = await API.patch(`/pilots/${id}`, pilotData);
  return response.data;
};

export const getPilotsByAirlineId = async (airlineId) => {
  try {
    const response = await API.get(`pilots/airline/${airlineId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching pilots for airline:", error);
    throw error;
  }
};