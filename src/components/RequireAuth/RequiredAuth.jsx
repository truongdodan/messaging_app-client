import React from "react";
import useAuth from "../../hook/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import "./RequiredAuth.css";
import { Spinner } from "../Sekeleton/Skeleton";

const RequiredAuth = () => {
  const { auth, authLoading } = useAuth();
  const location = useLocation();

  if (authLoading) {
    return (
      <div className="auth-loading">
        <div className="auth-loading__content">
          <div>Please wait ...</div>
          <Spinner />
        </div>
      </div>
    );
  }
  return auth?.user ? (
    <Outlet />
  ) : (
    <Navigate to={"./login"} state={{ from: location }} />
  );
};

export default RequiredAuth;
