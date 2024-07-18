import axios from './interceptor'
import router from '../router/index'

const CONFIG_URL = `http://localhost:3000/v1/users`; // Adjust the base URL according to your API structure


export const updateUser = (userId, body) => axios.patch(`${CONFIG_URL}/${userId}`, body);
// export const deleteConfig = (configId) => axios.delete(`${CONFIG_URL}/${configId}`);
export const getUser = (userId) => axios.get(`${CONFIG_URL}/${userId}`)