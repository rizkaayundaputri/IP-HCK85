import axios from 'axios';


const http = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 10000,
});

export default http;
