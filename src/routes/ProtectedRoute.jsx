import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Layout from '../components/layouts/Layout';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if(loading){
    return<div>
      <p>Loading here...</p>
    </div>
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

 return (<Layout>
      <Outlet />
    </Layout>
 )
};

export default ProtectedRoute;
