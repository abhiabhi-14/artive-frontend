import { useSelector, useDispatch } from 'react-redux'
import {
  selectUser,
  selectIsAuthenticated,
  selectIsAdmin,
  selectAuthLoading,
  selectAuthError,
  selectIsInitialized,
  loginUser,
  logoutUser,
  registerUser,
  fetchCurrentUser,
  clearError,
} from '../store/slices/authSlice'

export function useAuth() {
  const dispatch = useDispatch()

  const user            = useSelector(selectUser)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin         = useSelector(selectIsAdmin)
  const isLoading       = useSelector(selectAuthLoading)
  const error           = useSelector(selectAuthError)
  const isInitialized   = useSelector(selectIsInitialized)

  return {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    error,
    isInitialized,
    login:        (data) => dispatch(loginUser(data)),
    logout:       ()     => dispatch(logoutUser()),
    register:     (data) => dispatch(registerUser(data)),
    fetchUser:    ()     => dispatch(fetchCurrentUser()),
    clearError:   ()     => dispatch(clearError()),
  }
}
