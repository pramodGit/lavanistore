import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://localhost:5001',
  baseURL: '/',
  withCredentials: true, // send HTTP-only cookie
});

export default api;
