import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ?? "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post("/login", credentials);
    return response.data;
  },
};

export const loyaltyApi = {
  getBalance: async () => {
    const response = await apiClient.get("/balance");
    return response.data.balance;
  },

  getHistory: async () => {
    const response = await apiClient.get("/history");
    return response.data.transactions;
  },

  earnPoints: async (data: { amount: number; description: string }) => {
    const response = await apiClient.post("/earn", data);
    return response.data;
  },

  redeemPoints: async (data: { points: number; description: string }) => {
    const response = await apiClient.post("/redeem", data);
    return response.data;
  },
};

export default apiClient;
