import axios from './interceptor'


const SHIFTS_URL = `http://localhost:3000/v1/shifts`; // Adjust the base URL according to your API structure


export const getAllShifts = () => axios.get(SHIFTS_URL);
export const getShiftById = (shiftId) => axios.get(`${SHIFTS_URL}/${shiftId}`);
export const createShiftsMonth = (configData) => axios.post(`${SHIFTS_URL}/createShiftsMonth`, configData);
export const createShift = (shiftData) => axios.post(SHIFTS_URL, shiftData);
export const updateShift = (shiftId, shiftData) => axios.patch(`${SHIFTS_URL}/${shiftId}`, shiftData);
export const deleteShift = (shiftId) => axios.delete(`${SHIFTS_URL}/${shiftId}`);