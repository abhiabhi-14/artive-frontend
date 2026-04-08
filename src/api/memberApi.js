import axiosInstance from './axiosInstance'

export const memberApi = {
  getAllMembers: () =>
    axiosInstance.get('/members/all-members'),

  getMember: () =>
    axiosInstance.get('/members/get-member'),

  updateMember: (data) =>
    axiosInstance.patch('/members/update', data),

  uploadProfilePhoto: (formData) =>
    axiosInstance.post('/members/upload-profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  replaceProfilePhoto: (formData) =>
    axiosInstance.patch('/members/replace-profile-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}
