import axios from './interceptor'
import router from '../router/index'

const CONFIG_URL = `http://localhost:3000/v1/config`; // Adjust the base URL according to your API structure


export const getAllConfig = () => axios.get(CONFIG_URL);
export const getConfigById = (configId) => axios.get(`${CONFIG_URL}/${configId}`);
export const createConfig = (configData) => axios.post(CONFIG_URL, configData);
export const updateConfig = (configId, configData) => axios.patch(`${CONFIG_URL}/${configId}`, configData);
export const deleteConfig = (configId) => axios.delete(`${CONFIG_URL}/${configId}`);