import api from './api';

export const hotelService = {
  getHotels: async (params = {}) => {
    const res = await api.get('/hotels', { params });
    return res.data;
  },

  getHotelById: async (id) => {
    const res = await api.get(`/hotels/${id}`);
    return res.data;
  },

  checkAvailability: async (hotelId, params) => {
    const res = await api.get(`/hotels/${hotelId}/availability`, { params });
    return res.data;
  },

  getHotelReviews: async (hotelId, params = {}) => {
    const res = await api.get(`/hotels/${hotelId}/reviews`, { params });
    return res.data;
  },
};

export default hotelService;
