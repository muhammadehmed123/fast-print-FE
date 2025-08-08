import axios from 'axios';
import { BASE_URL } from './baseURL'; // import your centralized base URL

export const uploadBook = async (formData) => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('User not authenticated');

  const response = await axios.post(`${BASE_URL}api/books/upload-book/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`, // Send token here
    },
  });

  return response.data;
};
