// import the axios library to make HTTP requests
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

// In-memory access token, mirrored to localStorage so it survives reloads.
let accessToken: string | null = localStorage.getItem('accessToken');

// store the access token in memory 
export const setAccessToken = (token: string | null) => {
  accessToken = token;
  if (token) localStorage.setItem('accessToken', token);
  else localStorage.removeItem('accessToken');
};

export const getAccessToken = () => accessToken;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send the httpOnly refreshToken cookie
});

// Attach the bearer token to every request.
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});


let refreshing: Promise<string | null> | null = null;

// Refresh the access token using the refresh token cookie.

// Backend checks refreshToken cookie


const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    // Extract new access token from the response and store it in memory and localStorage
    const token: string = data.accessToken;
    setAccessToken(token);
    return token;
  } catch {
    setAccessToken(null);
    return null;
  }
};

// automatically refresh the access token if a request fails with 401 Unauthorized, and retry the original request.
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthCall = original?.url?.includes('/auth/');

    if (error.response?.status === 401 && !original._retry && !isAuthCall) {
      original._retry = true;
      refreshing = refreshing ?? refreshAccessToken();
      const token = await refreshing;
      refreshing = null;

      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
      // Refresh failed: bounce to login.
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Normalise an axios error into a readable message.
export const errorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message ?? err.message ?? 'Something went wrong';
  }
  return 'Something went wrong';
};
