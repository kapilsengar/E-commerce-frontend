// src/apiService.js
import axios from 'axios';

const apiUrl = "https://e-commerce-backend-hhie.onrender.com";

const apiService = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

export default apiService;