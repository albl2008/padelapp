// axiosConfig.js

import axios from 'axios';
import router from '../router/index';

let lastVisitedURL = null;


// Function to get the access token from local storage
export const getAccessToken = () => {
  const accessToken = localStorage.getItem('accessToken');
  return accessToken ? accessToken : null;
};

// Axios request interceptor for adding the bearer token to the headers
axios.interceptors.request.use((config) => {
  const accessToken = getAccessToken();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Axios response interceptor for handling 401 (Unauthorized) responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or unauthorized, redirect to login page
      setLastVisitedURL(router.currentRoute.value.fullPath);
      router.push('/login');
    }
    return Promise.reject(error);
  }
);

export default axios;

export const setLastVisitedURL = (url) => {
  lastVisitedURL = url;
};

export const getLastVisitedURL = () => lastVisitedURL;