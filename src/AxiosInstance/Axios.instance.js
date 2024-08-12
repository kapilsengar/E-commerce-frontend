// src/apiService.js
import axios from 'axios';

const apiUrl = process.env.REACT_APP_API;

const apiService = axios.create({
  baseURL: apiUrl,
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});

export default apiService;