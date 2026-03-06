import axios from 'axios';

const httpsRequests = axios.create({
    baseURL: import.meta.env.VITE_HTTPS_BACKEND,
    withCredentials: true, // đẩy cookie
});

httpsRequests.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export const GET = async ({ path, config }) => {
    const result = await httpsRequests.get(path, config);
    return result;
};
export const POST = async ({ path, data, config }) => {
    const result = await httpsRequests.post(path, data, config);
    return result;
};

export const PUT = async ({ path, data, config }) => {
    const result = await httpsRequests.put(path, data, config);
    return result;
};
export const DELETE = async ({ path, config }) => {
    const result = await httpsRequests.delete(path, config);
    return result;
};

export default httpsRequests;