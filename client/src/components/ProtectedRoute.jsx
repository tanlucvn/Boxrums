import { useContext, useEffect } from 'react';
import { Navigate, useNavigate, Outlet } from 'react-router-dom';

import { StoreContext } from '@/stores/Store';

export const GeneralRoute = () => {
  const { banned } = useContext(StoreContext)

  useEffect(() => {
    if (banned.status === true) {
      return navigate('/banned')
    }
  }, [banned])

  return <Outlet />
}

export const AuthRoute = () => {
  const { user, banned } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (banned.status === true) {
      return navigate('/banned')
    }
  }, [banned])

  if (user) {
    return <Navigate to="/" />
  }

  return <Outlet />;
}

export const UsersOnlyRoute = () => {
  const { user, banned } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (banned.status === true) {
      return navigate('/banned')
    }
  }, [banned])

  if (user) {
    return <Outlet />
  }

  return (
    <Navigate to="/login" />
  )
}

export const AdminsOnlyRoute = ({ component: Component, ...rest }) => {
  const { user, banned } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (banned.status === true) {
      return navigate('/banned')
    }
  }, [banned])

  if (user && user.role >= 2) {
    return <Outlet />
  }

  return (
    <Navigate to="/" />
  )
}
