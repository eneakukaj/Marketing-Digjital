import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>...</div>;

  console.log("USER:", user);
console.log("USER ROLES:", user?.userroles);
console.log("ALLOWED:", allowedRoles);

  if (!user) {
    return <Navigate to="/login" replace />;
  }
if (allowedRoles) {
    const hasPermission = user.userroles?.some(ur => {
    const roleName = ur.role?.normalized_name;
  return allowedRoles.some(ar => ar.toLowerCase() === roleName?.toLowerCase());
});


    if (!hasPermission) {
      return (
        <div className="min-h-screen bg-[#0f111a] flex items-center justify-center text-white">
          <h1 className="text-2xl font-bold">You do not have access to this page!</h1>
        </div>
      );
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
