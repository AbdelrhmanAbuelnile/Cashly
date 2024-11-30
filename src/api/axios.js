// src/api/axios.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:7000/api/v1', // Your backend URL
  withCredentials: true // Send cookies with requests
});

export default axiosInstance;