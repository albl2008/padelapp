import axios from './interceptor'
import router from '../router/index'

const REQUESTS_URL = `${import.meta.env.VITE_API_BASE_URL}/v1/request-access`;


export const getAllRequests = () => axios.get(REQUESTS_URL);
export const getRequestById = (requestId) => axios.get(`${REQUESTS_URL}/${requestId}`);
export const createRequest = (requestData) => axios.post(REQUESTS_URL, requestData);
export const updateRequest = (requestId, requestData) => axios.patch(`${REQUESTS_URL}/${requestId}`, requestData);
export const deleteRequest = (requestId) => axios.delete(`${REQUESTS_URL}/${requestId}`);
export const requestAccess = (info) => axios.post(`${REQUESTS_URL}/new`, info);
export const verify = (requestId, body) => axios.patch(`${REQUESTS_URL}/verify/${requestId}`, body);
export const sendInvitation = (requestId) => axios.post(`${REQUESTS_URL}/invite/${requestId}`);