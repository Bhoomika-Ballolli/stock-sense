import axios from "axios";

const api = axios.create({
  baseURL: "https://stock-backend-kxrh.onrender.com/api",
  timeout: 15000,
});

export const fetchStock = (symbol) => api.get(`/stock/${symbol}`);
export const fetchNews = (symbol) => api.get(`/news/${symbol}`);

export default api;
