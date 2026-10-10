import api from './api';

export const paymentService = {
  createCheckoutSession: async (bookingId) => {
    const res = await api.post('/payments/create-checkout-session', { bookingId });
    return res.data;
  },

  confirmDemoPayment: async (bookingId, demoCardLast4 = '4242') => {
    const res = await api.post('/payments/demo-confirm', { bookingId, demoCardLast4 });
    return res.data;
  },
};

export const reviewService = {
  submitReview: async (reviewData) => {
    const res = await api.post('/reviews', reviewData);
    return res.data;
  },
};

export const adminService = {
  getDashboard: async () => {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },

  getHotels: async () => {
    const res = await api.get('/admin/hotels');
    return res.data;
  },

  createHotel: async (data) => {
    const res = await api.post('/admin/hotels', data);
    return res.data;
  },

  updateHotel: async (id, data) => {
    const res = await api.put(`/admin/hotels/${id}`, data);
    return res.data;
  },

  deleteHotel: async (id) => {
    const res = await api.delete(`/admin/hotels/${id}`);
    return res.data;
  },

  createRoom: async (data) => {
    const res = await api.post('/admin/rooms', data);
    return res.data;
  },

  updateRoom: async (id, data) => {
    const res = await api.put(`/admin/rooms/${id}`, data);
    return res.data;
  },

  deleteRoom: async (id) => {
    const res = await api.delete(`/admin/rooms/${id}`);
    return res.data;
  },

  getBookings: async (params = {}) => {
    const res = await api.get('/admin/bookings', { params });
    return res.data;
  },

  updateBookingStatus: async (id, data) => {
    const res = await api.patch(`/admin/bookings/${id}/status`, data);
    return res.data;
  },

  getUsers: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },

  updateUserRole: async (id, role) => {
    const res = await api.patch(`/admin/users/${id}/role`, { role });
    return res.data;
  },

  getReviews: async () => {
    const res = await api.get('/admin/reviews');
    return res.data;
  },

  deleteReview: async (id) => {
    const res = await api.delete(`/admin/reviews/${id}`);
    return res.data;
  },
};

export default { paymentService, reviewService, adminService };
