import axios from 'axios';

const API_URL = '/api/zergs';

export const getZergs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addZerg = async (zerg) => {
  const response = await axios.post(API_URL, zerg);
  return response.data;
};
