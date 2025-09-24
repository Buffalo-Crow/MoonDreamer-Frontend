import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../../contexts/userContext";

export function ProtectedRoute({ children, anonymous = false }) {
  const { currentUser, loadingUser } = useContext(UserContext);
  const isLoggedIn = !!currentUser;

  const location = useLocation();
  const from = location.state?.from || "/";

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  if (anonymous && isLoggedIn) {
    return <Navigate to={from} replace />;
  }

  if (!anonymous && !isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
