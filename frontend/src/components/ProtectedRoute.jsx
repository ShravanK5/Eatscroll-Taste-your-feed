import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem('currentUser'));

  if (!user) {
    // Not logged in? Send them to the Landing page
    return <Navigate to="/" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    // Wrong role? Send them to their appropriate home
    return <Navigate to={user.role === 'customer' ? '/feed' : '/dashboard'} />;
  }

  return children;
};

export default ProtectedRoute;