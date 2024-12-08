import API from "./api";

export const getAllAircrafts = async () => {
  try {
    const response = await API.get("/aircrafts");
    return response.data;
  } catch (error) {
    console.error("Error fetching aircrafts:", error);
    throw error;
  }
};

export const getAircraftById = async (id) => {
  const response = await API.get(`/aircrafts/${id}`);
  return response.data;
};

export const createAircraft = async (aircraftData) => {
  try {
    const response = await API.post("/aircrafts", aircraftData);
    return response.data;
  } catch (error) {
    console.error("Error creating aircraft:", error);
  }
};

export const deleteAircraft = async (id) => {
  await API.delete(`/aircrafts/${id}`);
};

export const getAircraftsByAirlineId = async (id) => {
  try {
    const response = await API.get(`/aircrafts/airline/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching aircrafts from airline with id " , id, ":", error);
  }
}