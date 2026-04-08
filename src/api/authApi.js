import axiosInstance from './axiosInstance'

export const authApi = {
  register: (data) =>
    axiosInstance.post('/users/register', data),

  login: (data) =>
    axiosInstance.post('/users/login', data),

  logout: () =>
    axiosInstance.post('/users/logout'),

  getUser: () =>
    axiosInstance.get('/users/get-user'),

  refreshToken: () =>
    axiosInstance.post('/users/generate-token'),

  changePassword: (data) =>
    axiosInstance.post('/users/change-password', data),

  updateUserDetails: (data) =>
    axiosInstance.patch('/users/update-user-details', data),

  deleteUser: () =>
    axiosInstance.delete('/users/delete'),

  // Admin only
  getAllUsers: () =>
    axiosInstance.get('/users/all-users'),

  adminDeleteUser: (userId) =>
    axiosInstance.delete(`/users/admin-delete/${userId}`),
}
