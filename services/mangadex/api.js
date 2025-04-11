const axios = require('axios');
const config = require('../../config');

const BASE_URL = config.mangadexBaseUrl;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // Timeout 10s
});

module.exports = api;