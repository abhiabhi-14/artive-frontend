import axiosInstance from './axiosInstance'

export const eventApi = {
  getAllEvents: (params = {}) =>
    axiosInstance.get('/event/all-events', { params }),

  getEvent: (slug) =>
    axiosInstance.get(`/event/get-events/${slug}`),

  createEvent: (formData) =>
    axiosInstance.post('/event/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteEvent: (eventId) =>
    axiosInstance.delete(`/event/delete/${eventId}`),

  searchEvents: (params = {}) =>
    axiosInstance.get('/event/search', { params }),
}
