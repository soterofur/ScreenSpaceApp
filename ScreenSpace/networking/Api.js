import axios from 'axios';
import {config} from '../config/config';

axios.defaults.baseURL = config.BASE_URL;
axios.defaults.timeout = config.TIME_OUT;

function setHeaders(formData, token = null) {
  const headers = {
    'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
  };
  if (token) {
    headers.Authorization = `bearer ${token}`;
  }
  axios.defaults.headers.common = headers;
}

export {axios, setHeaders};
