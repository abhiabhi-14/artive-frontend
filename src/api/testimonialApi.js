import axiosInstance from './axiosInstance'

export const testimonialApi = {
  getAllTestimonials: () =>
    axiosInstance.get('/testimonial/all-Testimonials'),

  createTestimonial: (formData) =>
    axiosInstance.post('/testimonial/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deleteTestimonial: (testimonialId) =>
    axiosInstance.delete(`/testimonial/delete/${testimonialId}`),

  adminDeleteTestimonial: (testimonialId) =>
    axiosInstance.delete(`/testimonial/delete-admin/${testimonialId}`),
}
