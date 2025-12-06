import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/contact`;

export const submitContact = async (contactData) => {
  const response = await axios.post(API_URL, contactData);
  return response.data;
};

export const getContactMessages = async (page = 1, limit = 20, token) => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

