import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  timeout: 10000, // 10초 타임아웃
});

export default instance;
