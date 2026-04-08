import axiosInstance from './axiosInstance'

export const likeApi = {
  likePhoto: (photoId) =>
    axiosInstance.post(`/likes/photo/${photoId}`),

  unlikePhoto: (photoId) =>
    axiosInstance.delete(`/likes/delete/photo/${photoId}`),

  likeEvent: (eventId) =>
    axiosInstance.post(`/likes/event/${eventId}`),

  unlikeEvent: (eventId) =>
    axiosInstance.delete(`/likes/delete/event/${eventId}`),
}
