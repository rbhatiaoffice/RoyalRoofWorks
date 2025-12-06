import axios from 'axios';
import API_BASE_URL from './config';

const API_URL = `${API_BASE_URL}/reviews`;

export const getReviews = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`);
  return response.data;
};

export const getAllReviews = async (page = 1, limit = 20, token) => {
  const response = await axios.get(`${API_URL}/all?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const submitReview = async (reviewData, files = []) => {
  const formData = new FormData();
  formData.append('name', reviewData.name);
  formData.append('rating', reviewData.rating);
  formData.append('text', reviewData.text);
  
  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await axios.post(API_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const approveReview = async (id, token) => {
  const response = await axios.put(`${API_URL}/${id}/approve`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const deleteReview = async (id, token) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

