import axios from './interceptor'
import router from '../router/index'

const CLUB_URL = `http://localhost:3000/v1/club`; // Adjust the base URL according to your API structure


export const getAllClubs = () => axios.get(CLUB_URL);
export const getClubById = (clubId) => axios.get(`${CLUB_URL}/${clubId}`);
export const createClub = (clubData) => axios.post(CLUB_URL, clubData);
export const updateClub = (clubId, clubData) => axios.patch(`${CLUB_URL}/${clubId}`, clubData);
export const deleteClub = (clubId) => axios.delete(`${CLUB_URL}/${clubId}`);