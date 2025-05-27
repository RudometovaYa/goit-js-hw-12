import axios from 'axios';
export const PAGE_SIZE = 15;
/* const BASE_URL = 'https://pixabay.com/api/'; */
const API_KEY = '50294923-8c76cd495fb5b8c97be727835';

export async function getImagesByQuery(userValue, page) {
  const baseUrl = 'https://pixabay.com';
  const endPoint = '/api/';
  const url = baseUrl + endPoint;
  const params = {
    key: API_KEY,
    q: userValue,
    page: page,
    per_page: PAGE_SIZE,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  };
  const res = await axios.get(url, { params });
  return res.data;
}
