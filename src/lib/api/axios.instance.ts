import axios, {AxiosInstance, InternalAxiosRequestConfig, AxiosResponse} from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL; // без хардкоду!

const axiosInstance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {'Content-Type': 'application/json'},
    timeout: 10_000,
});


axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            original._retry = true;

            try {
                const refresh = localStorage.getItem('refresh_token');
                const {data} = await axios.post(`${BASE_URL}/auth/token/refresh/`, {refresh});

                localStorage.setItem('access_token', data.access);
                original.headers.Authorization = `Bearer ${data.access}`;

                return axiosInstance(original); // повторюємо оригінальний запит
            } catch {
                // refresh провалився — логаут
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;