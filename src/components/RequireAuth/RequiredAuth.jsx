import React from 'react'
import useAuth from '../../hook/useAuth'
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import "./RequiredAuth.css";

const RequiredAuth = () => {
    const {auth, authLoading} = useAuth();
    const location = useLocation();
    const test = true;

    if (authLoading) return <div className='auth-loading'>Loading Auth...</div>
  return (
    auth?.user
    ? <Outlet />
    : <Navigate to={"./login"} state={{from: location}}/>
  )
}

export default RequiredAuth;