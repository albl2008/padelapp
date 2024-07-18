import axios from './interceptor'
import router from '../router/index'

const FILES_URL = `http://localhost:3000/v1/files`; // Adjust the base URL according to your API structure

const GET_URL = `http://localhost:3000`;

const headers = {
      'Content-Type': 'multipart/form-data'
    }
export const createFile = (file) => axios.post(`${FILES_URL}/upload`, file, headers);
export const getFile = async (fileId) => {
    const response = await axios.get(`${GET_URL}/${fileId}`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    return url;
  };