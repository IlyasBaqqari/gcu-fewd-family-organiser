import { Navigate, Outlet } from 'react-router-dom';
import useToken from '../../hooks/useToken.jsx';

function ProtectedRoute() {
  const { token } = useToken();

  // If no token exists, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authorised, render the child route
  return <Outlet />;
}

export default ProtectedRoute;
