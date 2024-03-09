import { useContext, useEffect } from 'react';
import { Route, Navigate, useNavigate, Outlet } from 'react-router-dom';

import { StoreContext } from '@/stores/Store';

export const GeneralRoute = () => {
  const { user } = useContext(StoreContext)

  if (user && user.ban) {
    console.log("banned")
  }

  /* if (isBanned) {
    return <Navigate to="/banned" />
  } */
  return <Outlet />
}

export const AuthRoute = () => {
  const { user } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('ban')) return navigate('/banned')
  })

  if (user) {
    return <Navigate to="/" />
  }

  return <Outlet />;
}

export const UsersOnlyRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('ban')) return navigate('/banned')
  })

  return (
    <Route
      {...rest}
      render={(props) => (user ? <Component {...props} /> : <Navigate to="/signup" />)}
    />
  )
}

export const AdminsOnlyRoute = ({ component: Component, ...rest }) => {
  const { user } = useContext(StoreContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('ban')) return navigate('/banned')
  })

  return (
    <Route
      {...rest}
      render={(props) => (user && user.role >= 2 ? <Component {...props} /> : <Navigate to="/" />)}
    />
  )
}
