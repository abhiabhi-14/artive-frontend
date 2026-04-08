import axiosInstance from './axiosInstance'

export const photoApi = {
  getAllPhotos: (params = {}) =>
    axiosInstance.get('/photo/all-photo', { params }),

  getPhoto: (id) =>
    axiosInstance.get(`/photo/get-photo/${id}`),

  createPhoto: (formData) =>
    axiosInstance.post('/photo/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  deletePhoto: (photoId) =>
    axiosInstance.delete(`/photo/delete/${photoId}`),
}
