const axios = require('axios');

const dotenv = require('dotenv');
dotenv.config();

const BASE_URL = process.env.API_mangadex ;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout 10s
});

module.exports = api;