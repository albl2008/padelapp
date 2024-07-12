import axios from './interceptor'
import router from '../router/index'

const ADDONS_URL = `http://localhost:3000/v1/addons`; // Adjust the base URL according to your API structure


export const getAllAddons = () => axios.get(ADDONS_URL);
export const getAddonById = (addonId) => axios.get(`${ADDONS_URL}/${addonId}`);
export const createAddon = (addonData) => axios.post(ADDONS_URL, addonData);
export const updateAddon = (addonId, addonData) => axios.patch(`${ADDONS_URL}/${addonId}`, addonData);
export const deleteAddon = (addonId) => axios.delete(`${ADDONS_URL}/${addonId}`);