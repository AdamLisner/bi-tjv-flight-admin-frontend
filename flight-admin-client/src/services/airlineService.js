import API from './api';

export const getAllAirlines = async () => {
    const response = await API.get('/airlines');
    return response.data;
  };

  export const getAirlineById = async (id) => {
    const response = await API.get(`/airlines/${id}`);
    return response.data;
  };
  

  export const createAirline = async (airlineData) => {
    try {
    const response = await API.post('/airlines', airlineData);
    return response.data;
  } catch (error) {
    console.error('Error creating airline:', error);
    throw error;
  }  };
  
  export const deleteAirline = async (id) => {
    await API.delete(`/airlines/${id}`);
  };
  