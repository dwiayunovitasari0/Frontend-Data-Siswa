import axios from 'axios'; //u mengirim/mengambil data dari REST API

// Base URL backend (ganti kalau backend kamu pakai port lain)
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
});

export default api;
