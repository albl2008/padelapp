import axios from './interceptor'
import router from '../router/index'

const AUTH_ROUTE = `${import.meta.env.VITE_API_BASE_URL}/v1/auth`; // Adjust the base URL according to your API structure




// export const getAllConfig = () => axios.get(AUTH_ROUTE);
export const forgotPassword = (email) => axios.post(`${AUTH_ROUTE}/forgot-password`, email);
export const login = (loginData) => axios.post(`${AUTH_ROUTE}/login`, loginData);
export const logout = (refreshToken) => axios.post(`${AUTH_ROUTE}/logout`, refreshToken);
export const register = (registerData) => axios.post(`${AUTH_ROUTE}/register`, registerData);
export const verifyNewClub = (token, body) => axios.post(`${AUTH_ROUTE}/verify-email?token=${token}`, body);

// export const deleteConfig = (configId) => axios.delete(`${AUTH_ROUTE}/${configId}`);