import axios from './interceptor'
import router from '../router/index'

const COURTS_URL = `http://localhost:3000/v1/courts`; // Adjust the base URL according to your API structure


export const getAllCourts = () => axios.get(COURTS_URL);
export const getCourtById = (courtId) => axios.get(`${COURTS_URL}/${courtId}`);
export const createCourt = (courtData) => axios.post(COURTS_URL, courtData);
export const updateCourt = (courtId, courtData) => axios.patch(`${COURTS_URL}/${courtId}`, courtData);
export const deleteCourt = (courtId) => axios.delete(`${COURTS_URL}/${courtId}`);