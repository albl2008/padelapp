import axios from './interceptor'


const SHIFTS_URL = `${import.meta.env.VITE_API_BASE_URL}/v1/shifts`; // Adjust the base URL according to your API structure


export const getAllShifts = () => axios.get(SHIFTS_URL);
export const getShiftById = (shiftId) => axios.get(`${SHIFTS_URL}/${shiftId}`);
export const createShiftsMonth = (firstDayMonth,configData) => axios.post(`${SHIFTS_URL}/${firstDayMonth}/createShiftsMonth`, configData);
export const getShiftsWeek = (firstDayWeek) => axios.get(`${SHIFTS_URL}/week/${firstDayWeek}`);
export const getShiftsMonth = (firstDayMonth) => axios.get(`${SHIFTS_URL}/${firstDayMonth}/getMonth`);
export const createShift = (shiftData) => axios.post(SHIFTS_URL, shiftData);
export const getShiftsNextDays = (body) => axios.post(`${SHIFTS_URL}/get/next-days`, body);
export const updateShift = (shiftId, shiftData) => axios.patch(`${SHIFTS_URL}/${shiftId}`, shiftData);
export const bookShift = (shiftId, shiftData) => axios.patch(`${SHIFTS_URL}/booking/${shiftId}`, shiftData);
export const deleteShift = (shiftId) => axios.delete(`${SHIFTS_URL}/${shiftId}`);
export const getShiftsByCourt = (courtId) => axios.get(`${SHIFTS_URL}/court/${courtId}`);