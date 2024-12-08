import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080', // Your Swagger API base URL
});

export default API;
