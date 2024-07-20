import axios from './interceptor'
import router from '../router/index'

const CONFIG_URL = `${import.meta.env.VITE_API_BASE_URL}/v1/users`; // Adjust the base URL according to your API structure


export const updateUser = (userId, body) => axios.patch(`${CONFIG_URL}/${userId}`, body);
// export const deleteConfig = (configId) => axios.delete(`${CONFIG_URL}/${configId}`);
export const getUser = (userId) => axios.get(`${CONFIG_URL}/${userId}`)