import axios from 'axios';


const http = axios.create({
  baseURL: 'https://gc01.rzkaynd.xyz/',
  timeout: 10000,
});

export default http;
