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
  login: async (credentials: { phoneNumber: string }) => {
    const response = await apiClient.post("/login", credentials);
    return response.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    phoneNumber: string;
  }) => {
    const response = await apiClient.post("/register", userData);
    return response.data;
  },
};

export const loyaltyApi = {
  getBalance: async () => {
    const response = await apiClient.get("/balance");
    return response.data.balance;
  },

  getRewardTier: async () => {
    const response = await apiClient.get("/rewardtiers");
    return response.data;
  },

  getHistory: async (cursor?: string) => {
    const params = cursor ? { cursor } : {};
    const response = await apiClient.get("/history", { params });

    // Match the exact API response format: { "history": [], cursor: "" }
    return {
      transactions: response.data.transactions || [], // Use history array from response
      cursor: response.data.cursor || null, // Use cursor from response
      hasMore: !!response.data.cursor, // hasMore is true if cursor exists and is not empty
    };
  },

  earnPoints: async (data: { amount: number; description: string }) => {
    const response = await apiClient.post("/earn", data);
    return response.data;
  },

  redeemPoints: async (data: {
    amount: number;
    description: string;
    rewardtier: string;
  }) => {
    const response = await apiClient.post("/redeem", data);
    return response.data;
  },
};

export default apiClient;
