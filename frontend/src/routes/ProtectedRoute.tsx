import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const location = useLocation();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  console.log("Protected Route Check → TOKEN:", token);

  // If no token → redirect to login
/*  if (!token) {
    return (
      <Navigate 
        to="/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }
    */

  // If token exists → allow access
  return <Outlet />;
};

export default ProtectedRoute;