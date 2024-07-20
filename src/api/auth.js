import axios from './interceptor'
import router from '../router/index'

const CONFIG_URL = `${import.meta.env.VITE_API_BASE_URL}/v1/auth`; // Adjust the base URL according to your API structure


// export const getAllConfig = () => axios.get(CONFIG_URL);
export const forgotPassword = (email) => axios.post(`${CONFIG_URL}/forgot-password`, email);
export const login = (loginData) => axios.post(`${CONFIG_URL}/login`, loginData);
export const logout = (refreshToken) => axios.post(`${CONFIG_URL}/logout`, refreshToken);
export const register = (registerData) => axios.post(`${CONFIG_URL}/register`, registerData);
export const verify = (token) => axios.post(`${CONFIG_URL}/verify-email?token=${token}`)
// export const deleteConfig = (configId) => axios.delete(`${CONFIG_URL}/${configId}`);