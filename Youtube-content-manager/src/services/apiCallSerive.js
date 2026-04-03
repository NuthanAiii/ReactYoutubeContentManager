import axios from "axios";

const API_BASE_URL = import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_production_base_url
    : import.meta.env.VITE_local_base_url;

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            sessionStorage.removeItem('authToken');
            window.dispatchEvent(new Event('auth:expired'));
        }
        return Promise.reject(error);
    }
)

const createConfig = (data) => {
    const headers = {};
    if (data instanceof FormData) {
    } else if (data instanceof URLSearchParams) {
        headers['Content-Type'] = 'application/x-www-form-urlencoded';
    } else {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
}

export const fetchData = async (endpoint, param) => {
    try {
        if (param) return (await api.get(endpoint, { params: param })).data;
        return (await api.get(endpoint)).data;
    } catch (error) {
        throw error;
    }
};

export const fetchDataWithreq = async (endpoint, data, param) => {
    try {
        if (param) return (await api.post(endpoint, data, { params: param })).data;
        return (await api.post(endpoint, data)).data;
    } catch (error) {
        throw error;
    }
};

export const postData = async (endpoint, data) => {
    try {
        const headers = createConfig(data);
        return (await api.post(endpoint, data, { headers })).data;
    } catch (error) {
        throw error;
    }
};

export const getBotresponce = async (endpoint, data) => {
    try {
        const headers = createConfig(data);
        return (await api.post(endpoint, data, { headers })).data;
    } catch (error) {
        throw error;
    }
}
