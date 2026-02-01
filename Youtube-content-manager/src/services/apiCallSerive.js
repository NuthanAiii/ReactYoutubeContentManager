import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";
const api = axios.create({
    baseURL: API_BASE_URL,
    
})

api.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('authToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;

})

const createConfig = (data) =>{
    const headers = {};

    if (data instanceof FormData) {
      // For FormData, do NOT set Content-Type so browser/axios can set the boundary
    } else if (data instanceof URLSearchParams) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
      headers['Content-Type'] = 'application/json';
    }

    return headers;


}

export const fetchData = async (endpoint) => {
  try {
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};


export const postData = async (endpoint, data) => {
  try {
    // Build headers purely from 'data' (no config param expected)
    const headers = createConfig(data);

    const response = await api.post(endpoint, data, { headers });
    return response.data;
  } catch (error) {
    
    throw error;
  }
};




