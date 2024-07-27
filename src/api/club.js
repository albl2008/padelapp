import axios from './interceptor'
import router from '../router/index'

const CLUB_URL = `${import.meta.env.VITE_API_BASE_URL}/v1/club`; // Adjust the base URL according to your API structure


export const getAllClubs = () => axios.get(CLUB_URL);
export const getClubById = (clubId) => axios.get(`${CLUB_URL}/${clubId}`);
export const getActiveClub = () => axios.get(`${CLUB_URL}/club/active`);
export const createClub = (clubData) => axios.post(CLUB_URL, clubData);
export const updateClub = (clubId, clubData) => axios.patch(`${CLUB_URL}/${clubId}`, clubData);
export const deleteClub = (clubId) => axios.delete(`${CLUB_URL}/${clubId}`);