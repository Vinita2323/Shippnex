import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ role, redirectPath }) => {
  let tokenKey = 'shippnex_user_token';
  let defaultRedirect = '/login';

  if (role === 'seller') {
    tokenKey = 'shippnex_seller_token';
    defaultRedirect = '/seller/login';
  } else if (role === 'captain') {
    tokenKey = 'shippnex_captain_token';
    defaultRedirect = '/captain/login';
  } else if (role === 'admin') {
    tokenKey = 'shippnex_admin_token';
    defaultRedirect = '/admin/login';
  }

  const token = localStorage.getItem(tokenKey);

  if (!token) {
    return <Navigate to={redirectPath || defaultRedirect} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
