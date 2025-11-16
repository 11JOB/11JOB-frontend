import axios from "axios";

// 기본 API URL (Swagger UI 출처: https://11job.site/api)
const BASE_URL = "https://11job.site/api";

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
  timeout: 10000, // 10초 타임아웃
});

export default instance;
