import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (config.method != "get" && token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const fetchRestaurants = async ({
  term = "",
  price = "",
  latitude,
  longitude,
  location,
}) => {
  const params = {
    term,
    price,
    latitude,
    longitude,
    location,
  };

  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.append(key, value);
  });

  const response = await API.get(`/restaurants?${query.toString()}`);
  return response.data.restaurants;
};

export const fetchRestaurant = async (restaurantId) => {
  const response = await API.get(`/restaurant/${restaurantId}`);
  return response.data;
};

export const sendReview = async (params) => {
  await API.post(`/rate`, params);
};

export const deleteReview = async (reviewId) => {
  await API.delete(`/rate/${reviewId}`);
};

export const login = async (params) => {
  const response = await API.post(`/login`, params);
  return response.data.token;
};

export const register = async (params) => {
  const res = await API.post(`/register`, params);
};
