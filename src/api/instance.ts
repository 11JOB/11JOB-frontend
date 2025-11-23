import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const instance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10초 타임아웃
});

// 요청 인터셉터: 토큰이 있을 경우 Authorization 헤더 추가
instance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken"); // accessToken 가져오기
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`; // Authorization 헤더에 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
